const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true 
    },
    url : {
        type: String,
        required: true
    },
    posterUrl : {
        type: String,
        required: true
    },
    mood: {
        type: String,
        enum: {
            values: [ "sad", "happy", "Angry" ],
            message: "Enum this is"
        }
    }
});

const songModel = mongoose.model("Song", songSchema);

module.exports = songModel;