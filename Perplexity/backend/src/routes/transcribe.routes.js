import { Router } from "express";
import multer from "multer";
import { transcribeAudio } from "../controller/transcribe.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { chatRateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

const ALLOWED_MIME_TYPES = [
  "audio/webm",
  "audio/ogg",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/x-wav",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported audio format. Allowed: webm, ogg, mpeg, mp3, mp4, m4a, wav"));
    }
  },
});

router.post(
  "/",
  authMiddleware,
  chatRateLimit,
  upload.single("audio"),
  transcribeAudio
);

export default router;
