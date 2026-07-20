import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected. Adding displayOrder column...");
    await client.query(`ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 0;`);
    console.log("Column added successfully!");
  } catch (err) {
    console.error("Error adding column:", err);
  } finally {
    await client.end();
  }
}

main();
