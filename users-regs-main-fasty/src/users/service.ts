// src/users/service.ts
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";
import type { CreateUserInput } from "./types.ts";

export async function upsertUser(data: CreateUserInput) {
  const result = await db
    .insert(users)
    .values({
      visitorId: data.visitorId,
      clientIp: data.clientIp ?? null,
      name: data.name ?? null,
      email: data.email,
      browserData: data.browserData ?? null,
      source: data.source,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        visitorId: sql`EXCLUDED.visitor_id`,
        clientIp: sql`EXCLUDED.client_ip`,
        name: sql`COALESCE(EXCLUDED.name, ${users.name})`,
        browserData: sql`EXCLUDED.browser_data`,
        source: sql`EXCLUDED.source`,
        updatedAt: sql`NOW()`,
      },
    })
    .returning();

  const user = result[0];
  if (!user) {
    throw new Error("upsertUser: не вернулась запись после INSERT/UPDATE");
  }

  const isCreated = user.createdAt.getTime() === user.updatedAt.getTime();

  console.log(`Пользователь ${isCreated ? 'создан' : 'обновлён'} | ${user.email} | ${user.name} | ${user.visitorId}`);

  return {
    action: isCreated ? ("created" as const) : ("updated" as const),
    user,
  };
}

export async function getUserByVisitorId(visitorId: string) {
  const result = await db.select().from(users).where(eq(users.visitorId, visitorId)).limit(1);
  return result[0] ?? null;
}

export async function getStats() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(users);
  return Number(result[0]?.count ?? 0);
}

export async function getAllUsers() {
  return await db.select().from(users).orderBy(users.createdAt);
}