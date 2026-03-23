import { config as loadDotenv } from "dotenv";
import z from "zod";
import { logger } from "../utils/logger.js";

loadDotenv({ quiet: true });

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z
    .string()
    .default("8000")
    .transform(Number)
    .pipe(z.number().int().min(1).max(65535)),

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

function parseEnv() {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("\n");

    logger.fatal(
      `[Config] Missing or invalid environment variables:\n${formatted}\n`,
    );
    process.exit(1);
  }

  return result.data;
}

const env = parseEnv();

export const server = {
  env: env.NODE_ENV,
  port: env.PORT,
} as const;

export const db = {
  url: env.DATABASE_URL,
} as const;

export const jwt = {
  secret: env.JWT_SECRET,
  refreshExpiry: env.JWT_REFRESH_EXPIRY,
} as const;

export const cors = {
  origin: env.CORS_ORIGIN,
} as const;
