import { verifyAuthToken } from "../utils/jwt.js";
import { AppError } from "./error.middleware.js";

import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new AppError("No token provided", 401);
  }

  try {
    const payload = verifyAuthToken(token) as JwtPayload;
    req.userId = payload["userId"];
    next();
  } catch {
    next();
  }
};
