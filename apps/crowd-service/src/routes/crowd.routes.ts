import { Router } from 'express';
import * as crowdController from '../controllers/crowd.controller';
import { validateRequest } from '../middleware/validateRequest';
import { updateOccupancySchema, adjustCapacitySchema } from '../types/crowd.schemas';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/zones', authenticate, crowdController.getZones);
router.get('/zones/:id', authenticate, crowdController.getZoneById);

router.post(
  '/zones/:id/occupancy', 
  authenticate, 
  authorize(['operator', 'manager', 'admin']), 
  validateRequest(updateOccupancySchema), 
  crowdController.updateOccupancy
);

router.get('/zones/:id/occupancy', authenticate, crowdController.getOccupancy);
router.get('/heatmap', authenticate, crowdController.getHeatmap);

router.patch(
  '/zones/:id/capacity', 
  authenticate, 
  authorize(['manager', 'admin']), 
  validateRequest(adjustCapacitySchema), 
  crowdController.adjustCapacity
);

export default router;
