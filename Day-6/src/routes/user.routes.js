const express = require("express");
const { register } = require("../controller/auth.controller");
const { login } = require("../controller/auth.controller");
const { logout } = require("../controller/auth.controller");
const { createPost } = require("../controller/post.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { createAlbum } = require("../controller/post.controller");
const { getAllposts } = require("../controller/post.controller");
const { getAllAlbums } = require("../controller/post.controller");
const { deletePost } = require("../controller/post.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/create-post", authMiddleware, createPost);
router.post("/create-album", authMiddleware, createAlbum);
router.get("/", authMiddleware, getAllposts);
router.get("/getAllalbum", authMiddleware, getAllAlbums);
router.delete("/delete-post/:id", authMiddleware, deletePost);



module.exports = router;