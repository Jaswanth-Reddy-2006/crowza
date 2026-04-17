import { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase';
import pool from '../config/db';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { Incident } from '@crowza/shared';

export const createIncident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, severity, location } = req.body;
    const reportedBy = (req as any).user?.uid || 'anonymous';

    // 1. Save to PostgreSQL for persistence
    const result = await pool.query(
      'INSERT INTO incidents (type, severity, status, location, reported_by, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [type, severity, 'reported', location, reportedBy, new Date().toISOString()]
    );

    const incident = result.rows[0];

    // 2. Save to Firestore for real-time updates
    await db.collection('incidents').doc(incident.id.toString()).set({
      ...incident,
      id: incident.id.toString(),
      history: [{ status: 'reported', timestamp: new Date().toISOString() }]
    });

    res.status(201).json({ status: 'success', data: incident });
  } catch (error) {
    next(error);
  }
};

export const getIncidents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, severity } = req.query;
    let query = 'SELECT * FROM incidents';
    const params: any[] = [];

    if (status || severity) {
      query += ' WHERE';
      if (status) {
        params.push(status);
        query += ` status = $${params.length}`;
      }
      if (severity) {
        if (params.length > 0) query += ' AND';
        params.push(severity);
        query += ` severity = $${params.length}`;
      }
    }

    const result = await pool.query(query, params);
    res.json({ status: 'success', data: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getIncidentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const result = await pool.query('SELECT * FROM incidents WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
    }

    res.json({ status: 'success', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateIncident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const updates = req.body;

    const fields = Object.keys(updates);
    if (fields.length === 0) throw new AppError('No updates provided', 400);

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const params = [...Object.values(updates), id];

    const result = await pool.query(
      `UPDATE incidents SET ${setClause} WHERE id = $${params.length} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
        throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
    }

    // Sync with Firestore
    await db.collection('incidents').doc(id).update(updates);

    res.json({ status: 'success', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const assignIncident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { staffId } = req.body;

    const result = await pool.query(
      'UPDATE incidents SET assigned_to = $1, status = $2 WHERE id = $3 RETURNING *',
      [staffId, 'assigned', id]
    );

    if (result.rows.length === 0) {
        throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
    }

    const incident = result.rows[0];

    // Sync with Firestore and add to history
    const incidentRef = db.collection('incidents').doc(id);
    await db.runTransaction(async (t: any) => {
      const doc = await t.get(incidentRef);
      const history = doc.data()?.history || [];
      t.update(incidentRef, {
        assignedTo: staffId,
        status: 'assigned',
        history: [...history, { status: 'assigned', staffId, timestamp: new Date().toISOString() }]
      });
    });

    res.json({ status: 'success', data: incident });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const resolvedAt = status === 'resolved' ? new Date().toISOString() : null;

    const result = await pool.query(
      'UPDATE incidents SET status = $1, resolved_at = COALESCE($2, resolved_at) WHERE id = $3 RETURNING *',
      [status, resolvedAt, id]
    );

    if (result.rows.length === 0) {
        throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
    }

    const incident = result.rows[0];

    // Sync with Firestore and add to history
    const incidentRef = db.collection('incidents').doc(id);
    await db.runTransaction(async (t: any) => {
      const doc = await t.get(incidentRef);
      const history = doc.data()?.history || [];
      t.update(incidentRef, {
        status,
        resolvedAt: resolvedAt || doc.data()?.resolvedAt,
        history: [...history, { status, timestamp: new Date().toISOString() }]
      });
    });

    res.json({ status: 'success', data: incident });
  } catch (error) {
    next(error);
  }
};

export const deleteIncident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await pool.query('DELETE FROM incidents WHERE id = $1', [id]);
    await db.collection('incidents').doc(id).delete();

    res.json({ status: 'success', message: 'Incident closed/archived' });
  } catch (error) {
    next(error);
  }
};
