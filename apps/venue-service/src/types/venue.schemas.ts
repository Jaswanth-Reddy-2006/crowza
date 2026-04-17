import { z } from 'zod';

export const createZoneSchema = z.object({
  venueId: z.string(),
  name: z.string(),
  type: z.enum(['gate', 'restroom', 'concession', 'seating', 'parking']),
  capacity: z.number().int().positive(),
  polygon: z.array(z.array(z.number())).optional(),
});

export const updateZoneSchema = z.object({
  name: z.string().optional(),
  type: z.enum(['gate', 'restroom', 'concession', 'seating', 'parking']).optional(),
  capacity: z.number().int().positive().optional(),
});

export const capacityRuleSchema = z.object({
  zoneId: z.string(),
  maxPercentage: z.number().min(0).max(100),
  alertThreshold: z.number().min(0).max(100),
  action: z.enum(['notify', 'block_entry', 'divert_traffic']),
});
