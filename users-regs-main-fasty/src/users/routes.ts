// src/users/routes.ts
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createUserSchema } from "./schema.ts";
import { upsertUser, getUserByVisitorId, getStats, getAllUsers } from "./service.ts";

const SECRET_WORD = process.env.SECRET_WORD || "";

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/ping", async () => {
    return { pong: true, time: new Date().toISOString() };
  });

  fastify.get("/stats", async (request: FastifyRequest, reply: FastifyReply) => {
    const secret = (request.query as any).secret;
    if (secret !== SECRET_WORD) {
      return reply.code(403).send({ error: "Нет доступа" });
    }
    const totalUsers = await getStats();
    return { success: true, totalUsers };
  });

  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const secret = (request.query as any).secret;
    if (secret !== SECRET_WORD) {
      return reply.code(403).send({ error: "Доступ запрещён" });
    }
    const all = await getAllUsers();
    return { success: true, total: all.length, users: all };
  });

  fastify.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as any;
    if (!body.secret || body.secret !== SECRET_WORD) {
      return reply.code(403).send({ error: "Неправильное секретное слово" });
    }

    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      return reply.code(400).send({ error: validation.error });
    }

    const { secret, ...userData } = validation.data;

    try {
      const result = await upsertUser(userData as any);
      return reply.code(result.action === "created" ? 201 : 200).send({
        success: true,
        ...result,
      });
    } catch (err: any) {
      fastify.log.error({ err }, "Ошибка upsert пользователя");
      return reply.code(500).send({ error: "Не удалось сохранить пользователя" });
    }
  });

  fastify.get("/:visitorId", async (request: FastifyRequest, reply: FastifyReply) => {
    const { visitorId } = request.params as { visitorId: string };
    const user = await getUserByVisitorId(visitorId);
    if (!user) return reply.code(404).send({ error: "Пользователь не найден" });
    return { success: true, user };
  });
};

export default userRoutes;