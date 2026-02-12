import type { FastifyInstance } from 'fastify';
import type { RegisterRequest, RegisterResponse, ErrorResponse } from '../types/index.js';
import { registerUser } from '../services/partner1x.service.js';

export default async function registerRoute(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterRequest }>('/register', async (request, reply) => {
    // Передаем body и headers в сервис
    const result = await registerUser(request.body, request.headers);

    if ('success' in result) {
      return reply.send(result as RegisterResponse);
    } else {
      return reply.code(result.status || 400).send({
        success: false,
        message: result.error,
        code: result.status,
      } as ErrorResponse);
    }
  });
}