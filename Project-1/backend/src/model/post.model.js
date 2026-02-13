const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    imgUrl: {
        type: String,
        required: [ true, "imgUrl is required for creating an post" ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [ true, "user id is required for creating an post" ]
    }
},
{
    timestamps: true
})


const postModel = mongoose.model("posts", postSchema)


module.exports = postModel