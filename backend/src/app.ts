import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/logger.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import goalsRouter from "./modules/goals/goals.routes.js";

const app: express.Application = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/goals", goalsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use(errorMiddleware);

export default app;
