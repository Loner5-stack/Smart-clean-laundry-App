import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const { rows } = await pool.query('SELECT id, name, role, "customerNumber" FROM "User" ORDER BY "customerNumber" ASC NULLS LAST');
rows.forEach(r => console.log(JSON.stringify(r)));
await pool.end();
