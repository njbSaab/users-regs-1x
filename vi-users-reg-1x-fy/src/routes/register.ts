// src/routes/register.ts
import type { FastifyInstance } from 'fastify';
import type { RegisterRequest, RegisterResponse, ErrorResponse } from '../types/index.js';
import { registerUser } from '../services/partner1x.service.js';
import { saveUserInBackground } from '../services/userdb.service.js';

export default async function registerRoute(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterRequest }>('/register', async (request, reply) => {

    // ═══ ШАГ 1: Регистрация у партнёра (логика БЕЗ ИЗМЕНЕНИЙ) ═══
    const result = await registerUser(request.body, request.headers);

    if (!('success' in result)) {
      return reply.code(result.status || 400).send({
        success: false,
        message: result.error,
        code: result.status,
      } as ErrorResponse);
    }

    // ═══ ШАГ 2: Партнёр вернул success — готовим данные для БД ═══
    const body = request.body;
    const headers = request.headers;

    const userPayload = {
      visitorId: body.visitorId
        || (headers['x-visitor-id'] as string)
        || 'unknown',
      clientIp: body.clientIp
        || (headers['x-client-ip'] as string)
        || (headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
        || null,
      name: body.name || null,
      email: (body.email || '').trim().toLowerCase(),
      browserData: body.browserData || null,
      source: body.source || body.siteUrl || '',
    };

    // ═══ ШАГ 3: Запускаем сохранение юзера в БД (fire-and-forget) ═══
    // Вызываем ДО reply.send — функция НЕ блокирует, просто планирует async работу
    console.log('\n--- [ORCHESTRATOR] Партнёр OK → запускаем saveUserInBackground ---');
    saveUserInBackground(userPayload);

    // ═══ ШАГ 4: Отправляем ответ клиенту ═══
    return reply.send(result as RegisterResponse);
  });
}