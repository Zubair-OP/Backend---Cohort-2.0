const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    bio: {
        type: String,
    },
    ProfileImage : {
        type : String,
        default : "https://ik.imagekit.io/n5ds96x6w/profileimg.jpg"
    }

},
{
    timestamps:true
})

const userModel = mongoose.model("user", userSchema)


module.exports = userModel;