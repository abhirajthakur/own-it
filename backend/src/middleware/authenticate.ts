import { verifyAuthToken } from "../utils/jwt.js";
import { AppError } from "./errorHandler.js";

import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("No authorization header provided", 401);
  }

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Token must start with `Bearer `", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AppError("No token provided", 401);
  }

  try {
    const payload = verifyAuthToken(token) as JwtPayload;
    req.userId = payload.userId;
    next();
  } catch {
    next();
  }
};
