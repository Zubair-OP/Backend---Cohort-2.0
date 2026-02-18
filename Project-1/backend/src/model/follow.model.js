const mongoose = require("mongoose");

const followersSchema = new mongoose.Schema({
    follower : {
        type :String,
        required: [ true, "Follower is required" ]
    },
    followee : {
        type : String,
        required: [ true, "Followee is required" ]
    }
},
{
    timestamps : true
})

const followModel = mongoose.model("followers", followersSchema)

module.exports = followModel