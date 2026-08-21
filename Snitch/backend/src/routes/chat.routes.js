import { Router } from "express";
import { streamMessage } from "../controllers/chat.controller.js";
import { chatValidator } from "../validator/chat.validator.js";
import { chatLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/stream", chatLimiter, chatValidator, streamMessage);

export default router;
