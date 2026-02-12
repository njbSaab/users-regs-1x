// drizzle
import { pgTable, uuid, text, inet, jsonb, timestamp, varchar, bigserial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  visitorId: text('visitor_id').notNull().unique(),
  clientIp: inet('client_ip'), // для MariaDB замени на varchar('client_ip', { length: 45 })
  name: text('name'),
  email: text('email').unique(),
  browserData: jsonb('browser_data'),
  source: text('source').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});