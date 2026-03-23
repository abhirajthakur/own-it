import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { db as dbSchema } from "../config/index.js";
import * as schema from "./schema.js";

const pool = new Pool({
  connectionString: dbSchema.url,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });
