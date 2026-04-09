import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import {
  createCheckinHandler,
  getCheckinsHandler,
  getCheckinByIdHandler,
  updateCheckinHandler,
  deleteCheckinHandler,
} from "./checkin.controller.js";
import {
  createCheckinSchema,
  updateCheckinSchema,
  checkinParamsSchema,
  checkinQuerySchema,
} from "./checkin.types.js";

const router: Router = Router();

router.post(
  "/",
  authenticate,
  validate(createCheckinSchema),
  createCheckinHandler,
);

router.get(
  "/",
  authenticate,
  validate(checkinQuerySchema, "query"),
  getCheckinsHandler,
);

router.get(
  "/:id",
  authenticate,
  validate(checkinParamsSchema, "params"),
  getCheckinByIdHandler,
);

router.patch(
  "/:id",
  authenticate,
  validate(checkinParamsSchema, "params"),
  validate(updateCheckinSchema),
  updateCheckinHandler,
);

router.delete(
  "/:id",
  authenticate,
  validate(checkinParamsSchema, "params"),
  deleteCheckinHandler,
);

export default router;
