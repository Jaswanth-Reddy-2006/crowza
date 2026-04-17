import { z } from 'zod';

export const updateOccupancySchema = z.object({
  count: z.number().int().nonnegative(),
});

export const adjustCapacitySchema = z.object({
  capacity: z.number().int().positive(),
});
