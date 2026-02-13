const postModel = require("../model/post.model");
const { uploadFile, deleteFile } = require("../services/storage.service");
const albumModel = require("../model/album.model");

const createPost = async (req, res) => {
    const { title, caption } = req.body;
    const file = req.file;

    try {
        if (!title || !caption) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const Uploadimage = await uploadFile(file.buffer.toString('base64'))

        if (!Uploadimage) {
            return res.status(500).json({ message: "Image upload failed" });
        }

        const newPost = await postModel.create({ 
            title, 
            caption, 
            image: Uploadimage.url, 
            imageFileId: Uploadimage.fileId,
            owner: req.user.id 
        });

        
        res.status(201).json({ message: "Post created successfully",
            post: {
            title: newPost.title,
            caption: newPost.caption,
            image: newPost.image,
        } });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" , error: error.message });
    }
}

const createAlbum = async (req, res) => {
    try {
        const { title } = req.body;
        const files = req.files;

        if (!title || !files || files.length === 0) {
            return res.status(400).json({
                message: "Title and images are required"
            });
        }

        if (!req.user?.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // upload all images to cloudinary (parallel)
        const uploadPromises = files.map(async file =>
           await uploadFile(file.buffer.toString('base64'))
        );

        const uploadedImages = await Promise.all(uploadPromises);

        const imageUrls = uploadedImages.map(img => img.url);

        const imageFileIds = uploadedImages.map(img => img.fileId);

        const album = await albumModel.create({
            title : title,
            owner: req.user.id,
            images: imageUrls,
            imageFileIds: imageFileIds
        });

        res.status(201).json({
            message: "Album created successfully",
            album : {
                title: album.title,
                images: album.images,
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const getAllposts = async (req, res) => {
    try {
        const posts = await postModel.find().populate('owner', 'username email');

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json({ 
            message: "Posts fetched successfully",
            posts: posts
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getAllAlbums = async (req, res) => {
    try {
        const albums = await albumModel
            .find()
            .populate("owner", "username email");

        if (!albums || albums.length === 0) {
            return res.status(404).json({ message: "No albums found" });
        }

        res.status(200).json({
            message: "Albums fetched successfully",
            albums: albums,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const deletePost = async (req, res) => {
    const postId = req.params.id;

    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own posts" });
        }

        await postModel.findByIdAndDelete(postId);

        await deleteFile(post.imageFileId);

        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    createPost, createAlbum, getAllposts, getAllAlbums, deletePost
}