const likeModel = require('../model/like.model');
const postModel = require('../model/post.model');

const likeController = async (req, res) => {
    try {
        const userId = req.user.username;
        const postId = req.params.postusername;

        const isPostExist = await postModel.findById(postId);
        if (!isPostExist) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isAlreadyLiked = await likeModel.findOne({ post: postId, user: userId });

        if(isAlreadyLiked) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        const like = await likeModel.create({
            post: postId,
            user: userId
        })

        return res.status(200).json({ 
            message: 'Post liked successfully',
            like
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const unlikeController = async (req, res) => {
    try {
        const liker = req.user.username;
        const post = req.params.postusername;

        const isPostExist = await postModel.findById(post);
        if (!isPostExist) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await likeModel.findOneAndDelete({ post, user: liker });

        return res.status(200).json({
            message: 'Post unliked successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {likeController, unlikeController};