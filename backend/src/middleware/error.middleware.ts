import { ZodError } from "zod";

import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";

export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: "Validation failed.",
      fields: err.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  logger.error(`${err.message}`);
  res.status(500).json({ success: false, message: "Something went wrong" });
};
