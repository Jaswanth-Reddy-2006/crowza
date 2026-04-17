import { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase';
import pool from '../config/db';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { ZoneOccupancy, HeatMapData } from '@crowza/shared';

export const getZones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT * FROM zones');
    res.json({ status: 'success', data: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getZoneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const result = await pool.query('SELECT * FROM zones WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      throw new AppError('Zone not found', 404, 'ZONE_NOT_FOUND');
    }

    res.json({ status: 'success', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateOccupancy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { count } = req.body;

    // 1. Get zone capacity from PG
    const zoneResult = await pool.query('SELECT capacity, name FROM zones WHERE id = $1', [id]);
    if (zoneResult.rows.length === 0) {
      throw new AppError('Zone not found', 404, 'ZONE_NOT_FOUND');
    }
    const { capacity, name } = zoneResult.rows[0];

    // 2. Calculate percentage
    const occupancyPercent = (count / capacity) * 100;

    // 3. Update Firestore (Real-time)
    await db.collection('occupancy').doc(id).set({
      zoneId: id,
      name,
      current: count,
      max: capacity,
      occupancyPercent,
      lastUpdatedAt: new Date().toISOString(),
      status: occupancyPercent >= 95 ? 'critical' : occupancyPercent >= 80 ? 'warning' : 'normal',
    }, { merge: true });

    // 4. Log historical data in PG (Background/simplified)
    await pool.query(
      'INSERT INTO occupancy_logs (zone_id, occupancy_count, occupancy_percent) VALUES ($1, $2, $3)',
      [id, count, occupancyPercent]
    );

    res.json({
      status: 'success',
      data: { id, count, occupancyPercent },
    });
  } catch (error) {
    next(error);
  }
};

export const getOccupancy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const doc = await db.collection('occupancy').doc(id).get();
    
    if (!doc.exists) {
      throw new AppError('Occupancy data not found', 404, 'OCCUPANCY_NOT_FOUND');
    }

    res.json({ status: 'success', data: doc.data() });
  } catch (error) {
    next(error);
  }
};

export const getHeatmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const snapshot = await db.collection('occupancy').get();
    const zones: Record<string, number> = {};
    
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      zones[doc.id] = data.occupancyPercent;
    });

    const heatmap: HeatMapData = {
      zones,
      timestamp: new Date().toISOString(),
    };

    res.json({ status: 'success', data: heatmap });
  } catch (error) {
    next(error);
  }
};

export const adjustCapacity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { capacity } = req.body;

    const result = await pool.query(
      'UPDATE zones SET capacity = $1 WHERE id = $2 RETURNING *',
      [capacity, id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Zone not found', 404, 'ZONE_NOT_FOUND');
    }

    res.json({ status: 'success', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
