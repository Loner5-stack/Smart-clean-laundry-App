const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect().then(() => {
  return client.query('ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "isPopular" BOOLEAN NOT NULL DEFAULT false;');
}).then(() => {
  console.log('Migration OK');
  client.end();
}).catch(e => {
  console.error('Error:', e);
  client.end();
});
