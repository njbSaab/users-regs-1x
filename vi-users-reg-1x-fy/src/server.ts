// server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import registerRoute from './routes/register.js';
import { config } from './config/index.js';

const fastify = Fastify({ logger: true });

// ГЛАВНОЕ — правильный CORS с credentials: true
fastify.register(cors, {
  origin: true,                    // или укажи конкретные домены
  credentials: true,               // ЭТО РЕШАЕТ ТВОЮ ПРОБЛЕМУ!
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Cookie', 'x-client-ip', 'x-visitor-id'],
});

fastify.register(registerRoute);

fastify.get('/health', async () => ({
  status: 'ok',
  time: new Date().toISOString(),
}));

const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`Сервер запущен: http://localhost:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();