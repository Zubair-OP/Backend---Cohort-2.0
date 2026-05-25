import { Router } from "express";
import { streamMessage } from "../controllers/chat.controller.js";
import { chatValidator } from "../validator/chat.validator.js";

const router = Router();

router.post("/stream", chatValidator, streamMessage);

export default router;
