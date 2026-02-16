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
      siteUrl: data.siteUrl ?? null,
      isValidation: data.isValidation,
      login: typeof data.login === 'number' ? String(data.login) : data.login ?? null,
      password: data.password ?? null,
      deposit: data.deposit ?? null,
      main: data.main ?? null,
      domain: data.domain ?? null,
      isDeposited: data.isDeposited ?? false,
    })
    .onConflictDoUpdate({
      target: [users.email], 
      set: {
        visitorId: sql`EXCLUDED.visitor_id`,
        clientIp: sql`EXCLUDED.client_ip`,
        name: sql`COALESCE(EXCLUDED.name, ${users.name})`,
        browserData: sql`EXCLUDED.browser_data`,
        source: sql`EXCLUDED.source`,
        siteUrl: sql`EXCLUDED.site_url`,
        isValidation: sql`EXCLUDED.is_validation`,
        login: sql`EXCLUDED.login`,
        password: sql`EXCLUDED.password`,
        deposit: sql`EXCLUDED.deposit`,
        main: sql`EXCLUDED.main`,
        domain: sql`EXCLUDED.domain`,
        isDeposited: sql`EXCLUDED.is_deposited`,
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

export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] ?? null;
}

export async function updateUserById(id: number, data: Partial<CreateUserInput>) {
  const result = await db
    .update(users)
    .set({
      ...(data.visitorId !== undefined && { visitorId: data.visitorId }),
      ...(data.clientIp !== undefined && { clientIp: data.clientIp }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.browserData !== undefined && { browserData: data.browserData }),
      ...(data.source !== undefined && { source: data.source }),
      ...(data.siteUrl !== undefined && { siteUrl: data.siteUrl }),
      ...(data.isValidation !== undefined && { isValidation: data.isValidation }),
      ...(data.login !== undefined && { login: typeof data.login === 'number' ? String(data.login) : data.login }),
      ...(data.password !== undefined && { password: data.password }),
      ...(data.deposit !== undefined && { deposit: data.deposit }),
      ...(data.main !== undefined && { main: data.main }),
      ...(data.domain !== undefined && { domain: data.domain }),
      ...(data.isDeposited !== undefined && { isDeposited: data.isDeposited }),
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return result[0] ?? null;
}

export async function deleteUserById(id: number) {
  const result = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  return result.length > 0;
}