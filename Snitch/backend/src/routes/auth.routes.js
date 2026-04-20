import { Router } from "express";
const router = Router();
import { register } from "../controllers/auth.controller.js";
import { registerValidator } from "../validator/auth.validator.js";

router.post("/register", registerValidator, register);

export default router;
