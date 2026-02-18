const mongoose = require("mongoose");

const followersSchema = new mongoose.Schema({
    follower : {
        type :String,
        required: [ true, "Follower is required" ]
    },
    followee : {
        type : String,
        required: [ true, "Followee is required" ]
    },
    status: {
        type: String,
        default: "pending",
        enum: {
            values: [ "pending", "accepted", "rejected" ],
            message: "status can only be pending, accepted or rejected"
        }
    }
},
{
    timestamps : true
})
followersSchema.index({ follower: 1, followee: 1 }, { unique: true })


const followModel = mongoose.model("followers", followersSchema)

module.exports = followModel