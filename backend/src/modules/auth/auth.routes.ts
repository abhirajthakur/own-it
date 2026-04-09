import { Router } from "express";
import { loginHandler, registerHandler } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.types.js";
import { validate } from "../../middleware/validate.js";

const router: Router = Router();

router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);

export default router;
