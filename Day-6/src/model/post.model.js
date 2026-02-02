const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    caption : {
        type: String,
        required: true
    },
    image : {
        type: String,
        required: true
    },
    imageFileId : {
        type: String,
        required: true
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})
const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;