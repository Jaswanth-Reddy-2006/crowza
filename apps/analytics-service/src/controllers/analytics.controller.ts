import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { db } from '../config/firebase';
import { queryBigQuery } from '../config/bigquery';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import PDFDocument from 'pdfkit';

export const getOccupancyTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { range = '24h' } = req.query;
    // Simulate BigQuery or complex PG query for trends
    const data = await pool.query(
      'SELECT zone_id, AVG(occupancy_percent) as avg_occupancy, DATE_TRUNC(\'hour\', created_at) as hour FROM occupancy_logs GROUP BY zone_id, hour ORDER BY hour DESC'
    );
    res.json({ status: 'success', data: data.rows });
  } catch (error) {
    next(error);
  }
};

export const getIncidentSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await pool.query(
      'SELECT type, severity, COUNT(*) as count FROM incidents GROUP BY type, severity'
    );
    res.json({ status: 'success', data: data.rows });
  } catch (error) {
    next(error);
  }
};

export const getWaitTimes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const snapshot = await db.collection('occupancy').get();
    const waitTimes = snapshot.docs.map((doc: any) => ({
      zoneId: doc.id,
      estimatedWaitMins: Math.floor(Math.random() * 20), // Placeholder logic
      updatedAt: new Date().toISOString()
    }));
    res.json({ status: 'success', data: waitTimes });
  } catch (error) {
    next(error);
  }
};

export const generateReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doc = new PDFDocument();
    let filename = `report-${Date.now()}.pdf`;
    
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.fontSize(25).text('Event Analytics Report', 100, 100);
    doc.fontSize(15).text(`Generated at: ${new Date().toLocaleString()}`);
    
    // Add some summary data
    doc.text('\nOccupancy Summary:');
    const occupancyData = await pool.query('SELECT zone_id, MAX(occupancy_percent) as peak FROM occupancy_logs GROUP BY zone_id');
    occupancyData.rows.forEach((row: any) => {
      doc.text(`- Zone ${row.zone_id}: Peak ${row.peak}%`);
    });

    doc.text('\nIncident Summary:');
    const incidentData = await pool.query('SELECT type, COUNT(*) as total FROM incidents GROUP BY type');
    incidentData.rows.forEach((row: any) => {
        doc.text(`- ${row.type}: ${row.total}`);
    });

    doc.end();
    doc.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const emailReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    // Mock email sending
    logger.info(`Sending report for event ${id}`);
    res.json({ status: 'success', message: 'Report emailed successfully' });
  } catch (error) {
    next(error);
  }
};
