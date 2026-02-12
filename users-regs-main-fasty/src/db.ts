import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL не найден в .env");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();
console.log("Подключение к PostgreSQL успешно");

export const db = drizzle(client);