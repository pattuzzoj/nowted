import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql});
export type DatabaseType = typeof db;

export default defineConfig({
  schema: "./src/database/schema.ts",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
