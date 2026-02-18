const express = require('express');
const { followController,unfollowController , sendRequestController, acceptRequestController} = require('../controller/follow.controller');
const authMiddleware = require('../middleware/auth.middleware');
const followRouter = express.Router();

followRouter.post("/follow/:username", authMiddleware, followController)
followRouter.post("/unfollow/:username", authMiddleware, unfollowController)
followRouter.patch("/accept-request/:username", authMiddleware, acceptRequestController)
followRouter.post("/send-request/:username", authMiddleware, sendRequestController)


module.exports = followRouter