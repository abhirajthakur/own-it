import cors from "cors";
import express from "express";
import { cors as corsConfig, server } from "./config/index.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/logger.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";

const app: express.Application = express();

app.use(
  cors({
    origin: corsConfig.origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", env: server.env });
});

app.use("/api/auth", authRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use(errorMiddleware);

export default app;
