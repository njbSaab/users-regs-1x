// src/services/userdb.service.ts
// Fire-and-forget: после ответа клиенту отправляем данные на сервер юзеров
// Не блокирует основной флоу — если упадёт, клиент уже получил свой deposit URL

import 'dotenv/config';
import axios from 'axios';

const USER_API_URL = 'http://localhost:3440';
const USER_API_SECRET = process.env.SECRET_WORD || '';

interface SaveUserPayload {
  visitorId: string;
  clientIp: string | null;
  name: string | null;
  email: string;
  browserData: Record<string, any> | null;
  source: string;
}

/**
 * Отправляет данные юзера на сервер 2 в фоне.
 * Не блокирует — запускает промис без await.
 */
export function saveUserInBackground(payload: SaveUserPayload): void {
  console.log('\n--- [USER DB] saveUserInBackground ВЫЗВАНА ---');
  console.log('USER_API_URL:', USER_API_URL);
  console.log('USER_API_SECRET:', USER_API_SECRET ? `${USER_API_SECRET.slice(0, 8)}...` : '(пусто!)');

  // Запускаем async без await — не блокируем
  doSaveUser(payload).catch((err) => {
    console.error('--- [USER DB] Необработанная ошибка:', err.message);
  });
}

async function doSaveUser(payload: SaveUserPayload): Promise<void> {
  try {
    const url = `${USER_API_URL}/api/users`;
    const body = {
      secret: USER_API_SECRET,
      visitorId: payload.visitorId,
      clientIp: payload.clientIp,
      name: payload.name,
      email: payload.email,
      browserData: payload.browserData,
      source: payload.source,
    };

    console.log('--- [USER DB] POST →', url);
    console.log('--- [USER DB] Body:', JSON.stringify(body, null, 2));

    const res = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
      validateStatus: () => true,
    });

    console.log(`--- [USER DB] Ответ: ${res.status}`, JSON.stringify(res.data));
  } catch (err: any) {
    console.error('--- [USER DB] Ошибка запроса (не критично):', err.message);
    if (err.code) console.error('--- [USER DB] Error code:', err.code);
  }
}