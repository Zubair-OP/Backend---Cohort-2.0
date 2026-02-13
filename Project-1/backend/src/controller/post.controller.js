const postModel = require('../model/post.model');
const {uploadFile} = require('../services/storage.service');

const createPost = async (req,res) =>{
    try {
        const {caption} = req.body;
        const file = req.file;

        if(!caption || !file){
            return res.status(400).json({message:"Caption and Image are required"})
        }

        const uploadImage = await uploadFile(file.buffer);

        if(!uploadImage){
            return res.status(500).json({message:"Image upload failed"})
        }

        const newPost = await postModel.create({
            caption,
            imgUrl: uploadImage.url,
            user: req.user.id,
        });

        res.status(201).json({message:"Post created successfully", post: {
            caption: newPost.caption,
            imgUrl: newPost.imgUrl,
        }});

    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {
    createPost
}
