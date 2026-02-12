// src/services/partner1x.service.ts
import axios from 'axios';
import { generateSign } from '../utils/sign.js';
import { config } from '../config/index.js';
import type { RegisterRequest, RegisterResponse } from '../types/index.js';

export const registerUser = async (
  body: RegisterRequest,
  headers: Record<string, string | string[] | undefined>
): Promise<RegisterResponse | { error: string; status?: number }> => {

  const xClientIp = (headers['x-client-ip'] as string) ||
    (headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    '127.0.0.1';

  const xVisitorId = (headers['x-visitor-id'] as string) || '';
  const cookie = (headers['cookie'] as string) || '';
  const userAgent = (headers['user-agent'] as string) || 'AutoReg-TS/1.0';

  let email = (body.email || '').trim().toLowerCase();

  console.log('\n--- [1] INCOMING REQUEST FROM CLIENT ---');
  console.log('Headers:', { 'x-client-ip': xClientIp, 'x-visitor-id': xVisitorId, cookie });
  console.log('Body:', body);

  const sign = generateSign(config.partner.secret, config.partner.id, email);

  // const payload = {
  //   id: config.partner.id,
  //   sign: sign,
  //   email: email,
  //   country: config.defaults.country,
  //   currency: config.defaults.currency,
  //   send_reg_data: true,
  //   vip: false,
  //   is_remember_user: true,

  //   // === НОВЫЕ ПАРАМЕТРЫ ===
  //   tag: body.tag || '',
  //   pb: body.pb || '',
  //   click_id: body.click_id || '',
  //   custom_login_link: body.custom_login_link || '',
  // };

  const payload: any = {
    id: config.partner.id,
    sign: sign,
    email: email,
    country: config.defaults.country,
    currency: config.defaults.currency,
    send_reg_data: true,
    vip: false,
    is_remember_user: true,
  };

  if (body.tag) {
    payload.tag = body.tag;
  }
  if (body.pb) {
    payload.pb = body.pb;
  }
  if (body.click_id) {
    payload.click_id = body.click_id;
  }
  if (body.custom_login_link) {
    payload.custom_login_link = body.custom_login_link;
  }

  const outgoingHeaders = {
    'accept': 'application/json',
    'content-type': 'application/json;charset=UTF-8',
    'x-client-ip': xClientIp,
    'x-visitor-id': xVisitorId,
    'Cookie': cookie,
    'user-agent': userAgent,
  };

  console.log('--- [2] OUTGOING REQUEST TO PARTNER ---');
  console.log('URL:', config.partner.apiUrl);
  console.log('Headers:', outgoingHeaders);
  console.log('Payload:', payload);

  try {
    // АКСИОС САМ ХОДИТ ЗА ВСЕМИ РЕДИРЕКТАМИ И НЕ ПАДАЕТ
    const res = await axios.post(config.partner.apiUrl, payload, {
      headers: outgoingHeaders,
      maxRedirects: 20,           // на всякий случай
      timeout: 15000,
      validateStatus: () => true, // не падаем на 301/302/404
    });

    const data = res.data;

    console.log('--- [3] RESPONSE FROM PARTNER ---');
    console.log('Status:', res.status);
    console.log('Final URL:', res.request?.res?.responseUrl || 'unknown');
    console.log('Data:', data);

    // Если получили 200 и есть логин — всё ок
    if (res.status === 200 && data.login) {
      return {
        success: true as const,
        login: data.login,
        password: data.password,
        domain: data.domain,
        deposit: data.deposit,
        autologin: data.autologin || `https://${data.domain}${data.deposit}`,
        main: data.main || `https://${data.domain}${data.main}`,
        custom_login_link: data.custom_login_link || undefined,
      };
    }

    // Если 400/404/409 — возвращаем ошибку от партнёрки
    return {
      error: data.message || data.error || 'Registration failed',
      status: res.status,
    };

  } catch (error: any) {
    console.error('--- [ERROR] AXIOS FAILED ---', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
    return { error: error.message || 'Network error', status: 500 };
  }
};