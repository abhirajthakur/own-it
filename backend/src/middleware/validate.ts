import z from "zod";

import type { NextFunction, Request, Response } from "express";

type RequestPart = "body" | "query" | "params";

export const validate = (schema: z.ZodType, part: RequestPart = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[part]);

      if (part !== "body") {
        Object.defineProperty(req, part, {
          value: parsed,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } else {
        req.body = parsed;
      }

      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(422).json({
          success: false,
          error: "Validation failed",
          fields: err.issues.map((e) => ({
            name: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
};
