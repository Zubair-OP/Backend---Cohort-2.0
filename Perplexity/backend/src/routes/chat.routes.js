import { Router } from "express";
const router = Router();
import {
  HandleChat,
  HandleChatStream,
  getChats,
  getChatMessages,
  deleteChat,
} from "../controller/chat.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { chatRateLimit } from "../middleware/rateLimit.middleware.js";
import {
  messageValidator,
  chatIdValidator,
  handleChatValidationErrors,
} from "../validators/chat.validator.js";

router.post(
  "/message/stream",
  authMiddleware,
  chatRateLimit,
  messageValidator,
  handleChatValidationErrors,
  HandleChatStream
);
router.post(
  "/message",
  authMiddleware,
  chatRateLimit,
  messageValidator,
  handleChatValidationErrors,
  HandleChat
);
router.get("/", authMiddleware, getChats);
router.get("/messages/:Id", authMiddleware, chatIdValidator, handleChatValidationErrors, getChatMessages);
router.delete("/delete/:Id", authMiddleware, chatIdValidator, handleChatValidationErrors, deleteChat);

export default router;
