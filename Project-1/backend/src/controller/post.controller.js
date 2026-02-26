const postModel = require('../model/post.model');
const likeModel = require('../model/like.model');
const followModel = require('../model/follow.model');
const { uploadFile } = require('../services/storage.service');

const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const file = req.file;

        if (!caption || !file) {
            return res.status(400).json({ message: "Caption and Image are required" })
        }

        const uploadImage = await uploadFile(file.buffer);

        if (!uploadImage) {
            return res.status(500).json({ message: "Image upload failed" })
        }

        const newPost = await postModel.create({
            caption,
            imgUrl: uploadImage.url,
            user: req.user.id,
        });

        res.status(201).json({
            message: "Post created successfully", post: {
                caption: newPost.caption,
                imgUrl: newPost.imgUrl,
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const getPost = async (req, res) => {
    try {
        // Use req.params.id to get the user ID passed in the URL
        const id = req.params.id;

        const posts = await postModel.find({
            user: id
        });

        // Check if posts exist
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "Posts not found" })
        }

        res.status(200).json({
            message: "Posts fetched successfully",
            posts
        })
    } catch (error) {
        console.error("Error in getPost:", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const getPostDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const Postid = req.params.id;
        const post = await postModel.findById(Postid);

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        const isValidUser = post.user.toString() === userId

        if (!isValidUser) {
            return res.status(403).json({
                message: "Forbidden Content."
            })
        }

        res.status(200).json({
            message: "Post fetched successfully",
            post
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const getAllposts = async (req, res) => {

    const user = req.user.username

    const allPosts = await postModel.find().populate('user').lean()
    const posts = await Promise.all(allPosts.map(async post => {
        const isliked = await likeModel.findOne({ 
            post: post._id, user: user 
        })
        post.isliked = Boolean(isliked)

        const isFollowing = await followModel.findOne({
            follower: user,
            followee: post.user?.name
        })
        post.isFollowing = Boolean(isFollowing)

        return post
    }))

    return res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })
}


module.exports = {
    createPost,
    getPost,
    getPostDetails,
    getAllposts
}
