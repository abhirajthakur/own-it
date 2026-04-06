import * as authService from "./auth.service.js";

import type { NextFunction, Request, Response } from "express";
import type { LoginInput, RegisterInput } from "./auth.types.js";

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await authService.register(req.body as RegisterInput);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await authService.login(req.body as LoginInput);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}
