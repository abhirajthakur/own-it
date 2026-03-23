import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    const meta = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      ...(req.userId ? { userId: req.userId } : {}),
    };

    if (res.statusCode >= 500) {
      logger.error(meta, `${req.method} ${req.path}`);
    } else if (res.statusCode >= 400) {
      logger.warn(meta, `${req.method} ${req.path}`);
    } else {
      logger.info(meta, `${req.method} ${req.path}`);
    }
  });

  next();
}
