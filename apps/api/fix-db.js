const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

async function main() {
  const client = new Client({
    connectionString,
  });

  await client.connect();

  console.log("Dropping columns...");
  try {
    await client.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "national_id" CASCADE;');
    await client.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "is_ministry_id_verified" CASCADE;');
    await client.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "ministry_id_verified_at" CASCADE;');
    console.log("Successfully dropped drift columns from users table.");
  } catch (error) {
    console.error("Error dropping columns:", error);
  } finally {
    await client.end();
  }
}

main();
