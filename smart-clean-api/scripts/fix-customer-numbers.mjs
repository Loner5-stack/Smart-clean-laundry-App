/**
 * fix-customer-numbers.mjs
 *
 * Fixes the customerNumber sequence:
 * 1. Clears customerNumber from non-CUSTOMER users (ADMIN, RIDER, etc.)
 * 2. Re-numbers all CUSTOMER users sequentially from 1 (by createdAt)
 * 3. Resets the PostgreSQL sequence to (max + 1)
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  try {
    // Step 1: Clear customerNumber from ALL non-CUSTOMER users
    console.log("Step 1: Clearing customerNumber from non-CUSTOMER users...");
    const cleared = await client.query(
      `UPDATE "User" SET "customerNumber" = NULL WHERE role != 'CUSTOMER' AND "customerNumber" IS NOT NULL RETURNING name, role`
    );
    cleared.rows.forEach((r) =>
      console.log(`  🧹 Cleared from ${r.role}: ${r.name}`)
    );
    if (cleared.rows.length === 0) console.log("  (none to clear)");

    // Step 2: Fetch all customers ordered by createdAt
    console.log("\nStep 2: Re-numbering CUSTOMER users sequentially...");
    const { rows: customers } = await client.query(
      `SELECT id, name, "customerNumber", "createdAt" FROM "User" WHERE role = 'CUSTOMER' ORDER BY "createdAt" ASC`
    );
    console.log(`  Found ${customers.length} customer(s).`);

    if (customers.length > 0) {
      // Pass 1: set all to safe negative temp values to avoid unique conflicts
      for (let i = 0; i < customers.length; i++) {
        await client.query(
          `UPDATE "User" SET "customerNumber" = $1 WHERE id = $2`,
          [-(i + 10000), customers[i].id]
        );
      }
      // Pass 2: assign final sequential values
      for (let i = 0; i < customers.length; i++) {
        const newNumber = i + 1;
        await client.query(
          `UPDATE "User" SET "customerNumber" = $1 WHERE id = $2`,
          [newNumber, customers[i].id]
        );
        console.log(
          `  ✏️  "${customers[i].name}": customerNumber → ${newNumber} (CL-CUST-${String(newNumber).padStart(4, "0")})`
        );
      }
    }

    // Step 3: Reset the PostgreSQL sequence
    const nextVal = customers.length + 1;
    console.log(`\nStep 3: Resetting sequence to next value ${nextVal}...`);
    await client.query(
      `SELECT setval(pg_get_serial_sequence('"User"', 'customerNumber'), $1, false)`,
      [nextVal]
    );

    console.log(`\n✅ All done!`);
    console.log(
      `   Next new customer registration will be assigned: CL-CUST-${String(nextVal).padStart(4, "0")}`
    );
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
