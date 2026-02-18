const express = require('express');
const { likeController , unlikeController } = require('../controller/like.controller');
const authMiddleware = require('../middleware/auth.middleware');

const likerouter = express.Router();

likerouter.post('/like/:postusername', authMiddleware, likeController);
likerouter.post('/unlike/:postusername', authMiddleware, unlikeController);

module.exports = likerouter;