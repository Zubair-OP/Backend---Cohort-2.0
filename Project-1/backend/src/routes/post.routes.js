const express = require('express');
const postRouter = express.Router();
const postController = require('../controller/post.controller');
const authmiddleware = require('../middleware/auth.middleware');

postRouter.post("/create-post", authmiddleware, postController.createPost);
postRouter.get("/get-post/:id", authmiddleware, postController.getPost);
postRouter.get("/get-post-details/:id", authmiddleware, postController.getPostDetails);
postRouter.get('/feed', authmiddleware, postController.getAllposts);


module.exports = postRouter;