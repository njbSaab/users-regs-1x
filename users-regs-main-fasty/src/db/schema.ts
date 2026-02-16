// src/db/schema.ts
import { pgTable, bigserial, uuid, text, inet, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  visitorId: text('visitor_id').notNull(),        // убрали .unique()
  clientIp: inet('client_ip'),                    // null = не известно
  name: text('name'),
  email: text('email').unique(),
  browserData: jsonb('browser_data'),             // сюда всё: userAgent, экран и т.д.
  source: text('source').notNull(),               // google, telegram, direct, utm_...
  siteUrl: text('site_url'),                      // домен сайта клиента
  isValidation: boolean('is_validation'),         // статус валидации
  login: text('login'),                           // логин от партнера
  password: text('password'),                     // пароль от партнера
  deposit: text('deposit'),                       // ссылка депозита
  main: text('main'),                             // главная страница
  domain: text('domain'),                         // домен партнера
  isDeposited: boolean('is_deposited').default(false), // статус депозита
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});