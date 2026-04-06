import { ZodError } from "zod";
import { logger } from "../utils/logger.js";

import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (
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
