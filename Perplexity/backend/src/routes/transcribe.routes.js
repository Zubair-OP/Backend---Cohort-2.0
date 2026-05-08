import { Router } from "express";
import multer from "multer";
import { transcribeAudio } from "../controller/transcribe.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

router.post("/", upload.single("audio"), transcribeAudio);

export default router;
