import { Router } from 'express';
import * as venueController from '../controllers/venue.controller';
import { validateRequest } from '../middleware/validateRequest';
import { createZoneSchema, updateZoneSchema, capacityRuleSchema } from '../types/venue.schemas';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/venues/:id', authenticate, venueController.getVenue);
router.get('/venues/:id/zones', authenticate, venueController.getVenueZones);

router.post(
  '/zones', 
  authenticate, 
  authorize(['manager', 'admin']), 
  validateRequest(createZoneSchema), 
  venueController.createZone
);

router.patch(
  '/zones/:id', 
  authenticate, 
  authorize(['manager', 'admin']), 
  validateRequest(updateZoneSchema), 
  venueController.updateZone
);

router.get('/events', authenticate, venueController.getEvents);

router.post(
  '/events',
  authenticate,
  authorize(['manager', 'admin']),
  venueController.createEvent
);

router.post(
  '/capacity-rules', 
  authenticate, 
  authorize(['admin']), 
  validateRequest(capacityRuleSchema), 
  venueController.setCapacityRule
);

export default router;
