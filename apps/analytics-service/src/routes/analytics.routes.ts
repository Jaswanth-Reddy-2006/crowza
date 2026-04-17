import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/occupancy', authenticate, analyticsController.getOccupancyTrends);
router.get('/incidents', authenticate, analyticsController.getIncidentSummary);
router.get('/wait-times', authenticate, analyticsController.getWaitTimes);
router.get('/report', authenticate, authorize(['manager', 'admin']), analyticsController.generateReport);

router.post(
  '/events/:id/report', 
  authenticate, 
  authorize(['manager', 'admin']), 
  analyticsController.emailReport
);

export default router;
