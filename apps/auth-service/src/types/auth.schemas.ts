import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const qrVerifySchema = z.object({
  qrToken: z.string(),
  deviceId: z.string(),
});

export const mfaVerifySchema = z.object({
  mfaToken: z.string(),
  code: z.string().length(6),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
