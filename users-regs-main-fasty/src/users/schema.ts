// src/users/schema.ts
import { z } from 'zod';

const SECRET_WORD = process.env.SECRET_WORD || "fallback-secret-change-me";

export const createUserSchema = z.object({
  secret: z.string().refine((val) => val === SECRET_WORD, {
    message: "Неправильное секретное слово",
  }),
  visitorId: z.string().min(1),
  clientIp: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  email: z.string().email(),
  source: z.string().min(1),
  browserData: z.record(z.any()).optional(),
});
export const getUserSchema = z.object({
  secret: z.string().refine((val) => val === SECRET_WORD, {
    message: "Доступ запрещён",
  }),
  visitorId: z.string().min(1),
});