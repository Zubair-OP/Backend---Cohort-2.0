import { Router } from "express";
import { sendMessage, streamMessage } from "../controllers/chat.controller.js";
import { chatValidator } from "../validator/chat.validator.js";

const router = Router();

// Standard JSON request/response.
router.post("/message", chatValidator, sendMessage);

// Server-Sent Events: streams the reply token by token.
router.post("/stream", chatValidator, streamMessage);

export default router;
