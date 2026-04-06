import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import {
  createGoalHandler,
  getGoalsHandler,
  updateGoalHandler,
} from "./goals.controller.js";
import { createGoalSchema, updateGoalSchema } from "./goals.types.js";

const router: Router = Router();

router.get("/", authenticate, getGoalsHandler);
router.post("/", authenticate, validate(createGoalSchema), createGoalHandler);
router.put("/:id", authenticate, validate(updateGoalSchema), updateGoalHandler);

export default router;
