import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateAccessToken(data: { userId: string; email: string }) {
  const token = jwt.sign({ sub: data }, env.JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  } as SignOptions);
  return token;
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}
