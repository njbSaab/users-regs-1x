// js/api/partner.js
import { getVisitorId } from '../utils/browser.js';
import {saveUserX} from './user.js';
const PARTNER_API_URL = 'https://reg.devuser.pro'; // или прод

// js/api/partner.js
export async function registerAndGetDepositLink(email, trafficParams) {
  const visitorId = await getVisitorId();

  let clientIp = '0.0.0.0';
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    clientIp = data.ip;
  } catch (e) {}

  const payload = {
  email: email.trim(),};

  if (trafficParams.tag) payload.tag = trafficParams.tag;
  if (trafficParams.pb) payload.pb = trafficParams.pb;
  if (trafficParams.click_id) payload.click_id = trafficParams.click_id;
  if (trafficParams.custom_login_link) payload.custom_login_link = trafficParams.custom_login_link;
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
    // console.log('data-------------', data);
    // === НОВАЯ ЧАСТЬ: Сохраняем данные в нашу базу ===
    // Делаем это в фоне, не ждём ответа (fire-and-forget)
    saveUserX({
      ...data,                    // все данные от партнёра: domain, login, password, autologin, deposit и т.д.
      email: email.trim(),        // добавляем email, которого может не быть в data
      visitorId,                  // на всякий случай передаём явно
      source: location.href,      // откуда пришёл трафик
      siteUrl: location.href,
      clientIp,
      // name пока нет, но если будет — добавишь в payload выше
    }).catch(err => {
      console.warn('Не удалось сохранить user-x в базу (не критично):', err);
    });
    // === КОНЕЦ НОВОЙ ЧАСТИ ===

    let targetPath = data.deposit || '';  // по умолчанию deposit

    // Приоритет 1: custom_login_link (например, прямой вход в слот)
    if (data.custom_login_link && data.custom_login_link.trim() !== '') {
      targetPath = data.custom_login_link;
      console.log('Using custom_login_link:', targetPath);
    }
    // Приоритет 2: если нет custom — берём deposit
    else if (data.deposit && data.deposit.trim() !== '') {
      targetPath = data.deposit;
      console.log('Using deposit:', targetPath);
    }
    // Приоритет 3: крайний fallback — main (личный кабинет)
    else if (data.main && data.main.trim() !== '') {
      targetPath = data.main;
      console.log('Fallback to main:', targetPath);
    }
    // Если и main нет — можно бросить ошибку или fallback на autologin
    else if (data.autologin && data.autologin.startsWith('https://')) {
      console.log('Fallback to full autologin URL:', data.autologin);
      return data.autologin;  // уже полный URL, не нужно склеивать
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