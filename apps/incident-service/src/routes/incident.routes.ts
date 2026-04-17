import { Router } from 'express';
import * as incidentController from '../controllers/incident.controller';
import { validateRequest } from '../middleware/validateRequest';
import { 
  createIncidentSchema, 
  updateIncidentSchema, 
  assignIncidentSchema, 
  updateStatusSchema 
} from '../types/incident.schemas';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/', 
  authenticate, 
  validateRequest(createIncidentSchema), 
  incidentController.createIncident
);

router.get('/', authenticate, incidentController.getIncidents);
router.get('/:id', authenticate, incidentController.getIncidentById);

router.patch(
  '/:id', 
  authenticate, 
  authorize(['manager', 'admin']), 
  validateRequest(updateIncidentSchema), 
  incidentController.updateIncident
);

router.patch(
  '/:id/assign', 
  authenticate, 
  authorize(['manager', 'admin']), 
  validateRequest(assignIncidentSchema), 
  incidentController.assignIncident
);

router.patch(
  '/:id/status', 
  authenticate, 
  authorize(['operator', 'manager', 'admin']), 
  validateRequest(updateStatusSchema), 
  incidentController.updateStatus
);

router.delete(
  '/:id', 
  authenticate, 
  authorize(['admin']), 
  incidentController.deleteIncident
);

export default router;
