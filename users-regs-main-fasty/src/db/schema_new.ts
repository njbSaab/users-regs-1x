import { createTable, pgTable, bigserial, uuid, text, inet, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Определяем таблицу без уникального ограничения на visitorId
export const users = createTable('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull(),
  visitorId: text('visitor_id').notNull(), // Убрали .unique()
  clientIp: inet('client_ip'),                    // null = не известно
  name: text('name'),
  email: text('email').unique(), // Оставляем уникальность для email
  browserData: jsonb('browser_data'),             // сюда всё: userAgent, экран и т.д.
  source: text('source').notNull(),               // google, telegram, direct, utm_...
  siteUrl: text('site_url'),                      // домен сайта клиента
  isValidation: text('is_validation'),            // статус валидации
  login: text('login'),                           // логин от партнера
  password: text('password'),                     // пароль от партнера
  deposit: text('deposit'),                       // ссылка депозита
  main: text('main'),                             // главная страница
  domain: text('domain'),                         // домен партнера
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdateFn(() => new Date()),
});