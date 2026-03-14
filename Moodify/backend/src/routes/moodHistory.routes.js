const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { addMoodEntry, getMoodHistory } = require("../controllers/moodHistory.controller");

router.post("/", authMiddleware, addMoodEntry);
router.get("/", authMiddleware, getMoodHistory);

module.exports = router;
