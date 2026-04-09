import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { AppError } from "../../middleware/errorHandler.js";
import { hashPassword, verifyPassword } from "../../utils/hash.js";
import { generateAccessToken } from "../../utils/jwt.js";

import type { LoginInput, RegisterInput } from "./auth.types.js";

export async function register(input: RegisterInput) {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existing.length > 0) {
    throw new AppError("An account with that email already exists", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const [user] = await db
    .insert(users)
    .values({ name: input.name, email: input.email, password: passwordHash })
    .returning();

  if (!user) {
    throw new Error("Failed to create user");
  }

  const { password, ...userWithoutPassword } = user;

  const token = generateAccessToken({ userId: user.id, email: user.email });
  return { user: userWithoutPassword, token };
}

export async function login(input: LoginInput) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const valid = await verifyPassword(input.password, user.password);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateAccessToken({ userId: user.id, email: user.email });

  return { token };
}
