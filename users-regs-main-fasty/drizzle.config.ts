import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { logger } from "./src/utils";

if (!process.env.DATABASE_URL) {
  logger.error("DATABASE_URL не найден в .env");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

let connected = false;

export async function connectDB() {
  if (connected) return;
  await client.connect();
  connected = true;
  logger.info("Подключение к PostgreSQL успешно");
}

export const db = drizzle(client);

// Автоматически подключаемся при импорте (но безопасно)
connectDB().catch((err) => {
  logger.error("Ошибка подключения к БД", err);
  process.exit(1);
});