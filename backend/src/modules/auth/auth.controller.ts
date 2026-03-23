import * as authService from "./auth.service.js";
import { LoginSchema, RegisterSchema } from "./auth.types.js";

import type { NextFunction, Request, Response } from "express";

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = RegisterSchema.parse(req.body);
    const result = await authService.register(input);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = LoginSchema.parse(req.body);
    const result = await authService.login(input);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}
