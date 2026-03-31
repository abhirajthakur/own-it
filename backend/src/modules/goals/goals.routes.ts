import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createGoalHandler,
  getGoalsHandler,
  updateGoalHandler,
} from "./goals.controller.js";

const router: Router = Router();

router.get("/", authMiddleware, getGoalsHandler);
router.post("/", authMiddleware, createGoalHandler);
router.put("/:id", authMiddleware, updateGoalHandler);

export default router;
