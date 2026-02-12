// src/db.ts — финальная версия без fastify
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL не найден в .env");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

let connected = false;

export async function connectDB() {
  if (connected) return;
  try {
    await client.connect();
    connected = true;
    console.log("[DB] Подключение к PostgreSQL успешно");
  } catch (err) {
    console.error("[DB] Ошибка подключения к БД:", err);
    process.exit(1);
  }
}

export const db = drizzle(client);

// Автоматическое подключение (без fastify.log)
connectDB().catch((err) => {
  console.error("[DB] Ошибка автоподключения:", err);
  process.exit(1);
});