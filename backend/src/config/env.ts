import "dotenv/config";
import { z } from "zod";
import { logger } from "../utils/logger.js";

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  DATABASE_URL: z
    .url("DATABASE_URL must be a valid connection URL")
    .startsWith(
      "postgres",
      "DATABASE_URL must be a PostgreSQL connection string",
    ),

  JWT_SECRET: z.string(),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join("\n");

  logger.fatal(
    `[Config] Missing or invalid environment variables:\n${formatted}\n`,
  );
  process.exit(1);
}

export const env = parsed.data;
