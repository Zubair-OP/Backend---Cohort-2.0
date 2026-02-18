const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type : String,
        required : true
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "posts",
        required : true
    }
},
{
    timestamps: true
})

likeSchema.index({ post: 1, user: 1 }, { unique: true })

const likeModel = mongoose.model('like', likeSchema);

module.exports = likeModel;