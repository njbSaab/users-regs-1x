// src/users/routes.ts
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createUserSchema } from "./schema.ts";
import { upsertUser, getUserByVisitorId, getStats, getAllUsers, getUserById, updateUserById, deleteUserById } from "./service.ts";

const SECRET_WORD = process.env.SECRET_WORD || "";

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/ping", async () => {
    return { pong: true, time: new Date().toISOString() };
  });

  fastify.get("/stats", async (request: FastifyRequest, reply: FastifyReply) => {
    const secret = (request.headers as any)["x-secret-word"] || (request.headers as any)["X-Secret-Word"];
    if (secret !== SECRET_WORD) {
      return reply.code(403).send({ error: "Нет доступа" });
    }
    const totalUsers = await getStats();
    return { success: true, totalUsers };
  });

  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const secret = (request.headers as any)["x-secret-word"] || (request.headers as any)["X-Secret-Word"];
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

  // Получить пользователя по ID (требует секретное слово в заголовке)
  fastify.get("/by-id/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const id = parseInt(request.params["id"] as string, 10);
    const secret = (request.headers as any)["x-secret-word"] || (request.headers as any)["X-Secret-Word"];
    const SECRET_WORD = process.env.SECRET_WORD || "";
    
    if (secret !== SECRET_WORD) {
      return reply.code(403).send({ error: "Доступ запрещён" });
    }
    
    if (isNaN(id)) {
      return reply.code(400).send({ error: "Неверный ID пользователя" });
    }
    
    const user = await getUserById(id);
    if (!user) return reply.code(404).send({ error: "Пользователь не найден" });
    return { success: true, user };
  });

  // Обновить пользователя по ID (требует секретное слово в заголовке)
  fastify.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const id = parseInt(request.params["id"] as string, 10);
    const secret = (request.headers as any)["x-secret-word"] || (request.headers as any)["X-Secret-Word"];
    const SECRET_WORD = process.env.SECRET_WORD || "";
    
    if (secret !== SECRET_WORD) {
      return reply.code(403).send({ error: "Доступ запрещён" });
    }
    
    if (isNaN(id)) {
      return reply.code(400).send({ error: "Неверный ID пользователя" });
    }
    
    const validation = createUserSchema.partial().safeParse(request.body);
    if (!validation.success) {
      return reply.code(400).send({ error: validation.error });
    }

    try {
      const result = await updateUserById(id, validation.data);
      if (!result) {
        return reply.code(404).send({ error: "Пользователь не найден" });
      }
      return reply.code(200).send({
        success: true,
        action: "updated",
        user: result,
      });
    } catch (err: any) {
      fastify.log.error({ err }, "Ошибка обновления пользователя");
      return reply.code(500).send({ error: "Не удалось обновить пользователя" });
    }
  });

  // Удалить пользователя по ID (требует секретное слово в заголовке)
  fastify.delete("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const id = parseInt(request.params["id"] as string, 10);
    const secret = (request.headers as any)["x-secret-word"] || (request.headers as any)["X-Secret-Word"];
    const SECRET_WORD = process.env.SECRET_WORD || "";
    
    if (secret !== SECRET_WORD) {
      return reply.code(403).send({ error: "Доступ запрещён" });
    }
    
    if (isNaN(id)) {
      return reply.code(400).send({ error: "Неверный ID пользователя" });
    }
    
    try {
      const deleted = await deleteUserById(id);
      if (!deleted) {
        return reply.code(404).send({ error: "Пользователь не найден" });
      }
      return reply.code(200).send({
        success: true,
        message: "Пользователь успешно удален",
      });
    } catch (err: any) {
      fastify.log.error({ err }, "Ошибка удаления пользователя");
      return reply.code(500).send({ error: "Не удалось удалить пользователя" });
    }
  });
};

export default userRoutes;