import jwt, { type SignOptions } from "jsonwebtoken";
import { jwt as jwtConfig } from "../config/index.js";

export function generateAccessToken(data: { userId: string; email: string }) {
  const token = jwt.sign({ sub: data }, jwtConfig.secret, {
    expiresIn: jwtConfig.refreshExpiry,
  } as SignOptions);
  return token;
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, jwtConfig.secret);
}
