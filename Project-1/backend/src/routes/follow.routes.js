const express = require('express');
const { followController,unfollowController } = require('../controller/follow.controller');
const authMiddleware = require('../middleware/auth.middleware');
const followRouter = express.Router();

followRouter.post("/follow/:username", authMiddleware, followController)
followRouter.post("/unfollow/:username", authMiddleware, unfollowController)

module.exports = followRouter