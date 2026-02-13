const express = require('express');
const postRouter = express.Router();
const postController = require('../controller/post.controller');
const authmiddleware = require('../middleware/auth.middleware');

postRouter.post("/create-post", authmiddleware, postController.createPost);

module.exports = postRouter;