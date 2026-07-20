import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'Service' AND column_name = 'displayOrder';`);
    console.log("Columns found:", res.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

main();
