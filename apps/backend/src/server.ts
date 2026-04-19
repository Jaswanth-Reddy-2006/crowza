import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import organizerRoutes from './routes/organizerRoutes';

const app = express();

// Disable helmet for now to resolve CSP blockers in local web preview
// app.use(helmet({
//   contentSecurityPolicy: false,
// }));
app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'up' });
});

app.get('/venues/:venueId/occupancy-summary', (req: Request, res: Response) => {
  res.json({
    data: {
      totalCapacity: 50000,
      currentOccupancy: 34201,
      occupancyPercentage: 68,
      criticalZones: 2
    }
  });
});

app.get('/incidents', (req: Request, res: Response) => {
  res.json({
    data: {
      total: 12,
      active: 4,
      byPriority: { critical: 1, high: 2, normal: 5, low: 4 }
    }
  });
});

app.get('/queues/average', (req: Request, res: Response) => {
  res.json({
    data: {
      avgWaitMins: 14,
      trend: 'decreasing'
    }
  });
});

// Analytics Dashboard Mocks
app.get('/analytics/occupancy', (req: Request, res: Response) => {
  res.json({
    data: {
      currentOccupancy: 34201,
      peakOccupancy: 38500,
      velocity: 120,
      trends: [
        { timestamp: '12:00', value: 12000, label: 'Noon' },
        { timestamp: '13:00', value: 18000, label: '1 PM' },
        { timestamp: '14:00', value: 25000, label: '2 PM' },
        { timestamp: '15:00', value: 34201, label: '3 PM' }
      ],
      zoneBreakdown: [
        { name: 'North Gate', value: 85 },
        { name: 'South Gate', value: 45 },
        { name: 'East Concourse', value: 92 }
      ]
    }
  });
});

app.get('/analytics/incidents', (req: Request, res: Response) => {
  res.json({
    data: {
      total: 42,
      resolved: 38,
      avgResolutionTime: '8m 12s',
      byStatus: { active: 4, resolved: 38 },
      bySeverity: { critical: 1, high: 5, normal: 36 }
    }
  });
});

app.get('/analytics/wait-times', (req: Request, res: Response) => {
  res.json({
    data: {
      avgWaitTime: 14,
      maxWaitTime: 28,
      trends: [
        { timestamp: '12:00', value: 5, label: 'Noon' },
        { timestamp: '13:00', value: 12, label: '1 PM' },
        { timestamp: '14:00', value: 22, label: '2 PM' },
        { timestamp: '15:00', value: 14, label: '3 PM' }
      ],
      zones: [
        { name: 'Gate A', wait: 5 },
        { name: 'Gate B', wait: 18 },
        { name: 'Concessions', wait: 12 }
      ]
    }
  });
});

// ===== ORGANIZER & EVENT ROUTES =====
app.use('/organizers', organizerRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
