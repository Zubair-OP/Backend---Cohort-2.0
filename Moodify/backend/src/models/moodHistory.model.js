const mongoose = require("mongoose");

const moodHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    emotion: {
        type: String,
        required: true,
    },
    songCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const MoodHistory = mongoose.model("MoodHistory", moodHistorySchema);

module.exports = MoodHistory;
