// src/index.ts — рабочий вариант без utils/logger
import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import userRoutes from "./users/routes.ts";

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",  // info, debug, warn, error
    transport: {
      target: "pino-pretty",                 // красивая консоль в dev
      options: {
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
});

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
});

fastify.get("/", async () => {
  return "Users API v1 — работает!";
});

fastify.register(userRoutes, { prefix: "/api/users" });

fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send("404 — роут не найден");
});

const port = Number(process.env.PORT) || 3440;

fastify.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Users API запущен → http://194.36.179.168:${port}`);
});