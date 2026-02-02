const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [ 'user', 'artist' ],
        default: 'user',
    }
},{ timestamps: true });

const Usermodel = mongoose.model('User', userSchema);

module.exports = Usermodel;