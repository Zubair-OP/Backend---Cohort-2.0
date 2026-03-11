const express = require("express");
const router = express.Router();
const songController = require("../controllers/song.controller");
const upload = require("../middlewares/upload.middleware");

router.post("/", upload.single("song"), songController.uploadSong);
router.get("/", songController.getSongsByMood);

module.exports = router