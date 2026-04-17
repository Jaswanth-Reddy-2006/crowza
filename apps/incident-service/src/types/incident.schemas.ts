import { z } from 'zod';
import { IncidentType } from '@crowza/shared';

export const createIncidentSchema = z.object({
  type: z.nativeEnum(IncidentType),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  location: z.string(),
  description: z.string().optional(),
});

export const updateIncidentSchema = z.object({
  status: z.enum(['reported', 'assigned', 'in_progress', 'resolved']).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  location: z.string().optional(),
});

export const assignIncidentSchema = z.object({
  staffId: z.string(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['reported', 'assigned', 'in_progress', 'resolved']),
});
