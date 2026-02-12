// src/db/schema.ts
import { pgTable, bigserial, uuid, text, inet, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  visitorId: text('visitor_id').notNull().unique(),
  clientIp: inet('client_ip'),                    // null = не известно
  name: text('name'),
  email: text('email').unique(),
  browserData: jsonb('browser_data'),             // сюда всё: userAgent, экран и т.д.
  source: text('source').notNull(),               // google, telegram, direct, utm_...
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});