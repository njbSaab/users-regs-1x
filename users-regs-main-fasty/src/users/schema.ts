// src/users/schema.ts
import { z } from 'zod';

// Zod v4 крашится на .refine() — проверяем secret вручную в роуте
export const createUserSchema = z.object({
  secret: z.string(),
  visitorId: z.string().min(1),
  clientIp: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  email: z.string().email(),
  source: z.string().min(1),
  browserData: z.record(z.string(), z.any()).optional(),
});

export const getUserSchema = z.object({
  secret: z.string(),
  visitorId: z.string().min(1),
});