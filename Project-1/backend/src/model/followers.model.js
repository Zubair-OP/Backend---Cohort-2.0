const mongoose = require("mongoose");

const followersSchema = new mongoose.Schema({
    follower : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required: [ true, "Follower is required" ]
    },
    followee : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required: [ true, "Followee is required" ]
    }
},
{
    timestamps : true
})

const followersModel = mongoose.model("followers", followersSchema)

module.exports = followersModel