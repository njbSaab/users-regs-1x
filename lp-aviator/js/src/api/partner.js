// js/api/partner.js
// Один запрос на reg.devuser.pro — сервер сам сохранит юзера в БД
import { getVisitorId, getBrowserData, getIp } from '../utils/browser.js';

const PARTNER_API_URL = 'http://127.0.0.1:3390';

export async function registerAndGetDepositLink(email, name, trafficParams) {
  const visitorId = await getVisitorId();
  const clientIp = await getIp();

  // Расширенный payload: данные для партнёра + данные для БД юзеров
  const payload = {
    // Для партнёра (как было)
    email: email.trim(),
  };

  if (trafficParams.tag) payload.tag = trafficParams.tag;
  if (trafficParams.pb) payload.pb = trafficParams.pb;
  if (trafficParams.click_id) payload.click_id = trafficParams.click_id;
  if (trafficParams.custom_login_link) payload.custom_login_link = trafficParams.custom_login_link;

  // НОВОЕ: данные для сервера юзеров (сервер перешлёт сам)
  payload.visitorId = visitorId;
  payload.clientIp = clientIp;
  payload.name = name?.trim() || null;
  payload.browserData = getBrowserData();
  payload.source = location.href;
  payload.siteUrl = location.href;

  console.log('payload-------------', payload);

  try {
    const response = await fetch(`${PARTNER_API_URL}/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-visitor-id': visitorId,
        'x-client-ip': clientIp,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }

    const data = await response.json();

    // === Формируем URL (логика без изменений) ===
    let targetPath = data.deposit || '';

    // Приоритет 1: custom_login_link
    if (data.custom_login_link && data.custom_login_link.trim() !== '') {
      targetPath = data.custom_login_link;
      console.log('Using custom_login_link:', targetPath);
    }
    // Приоритет 2: deposit
    else if (data.deposit && data.deposit.trim() !== '') {
      targetPath = data.deposit;
      console.log('Using deposit:', targetPath);
    }
    // Приоритет 3: main
    else if (data.main && data.main.trim() !== '') {
      targetPath = data.main;
      console.log('Fallback to main:', targetPath);
    }
    // Приоритет 4: autologin
    else if (data.autologin && data.autologin.startsWith('https://')) {
      console.log('Fallback to full autologin URL:', data.autologin);
      return data.autologin;
    }

    if (targetPath) {
      return `https://${data.domain}${targetPath}`;
    }

    throw new Error('No deposit link in response');
  } catch (err) {
    console.error('registerAndGetDepositLink error:', err);
    throw err;
  }
}