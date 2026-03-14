const MoodHistory = require("../models/moodHistory.model");

const addMoodEntry = async (req, res) => {
    try {
        const { emotion, songCount } = req.body;

        if (!emotion) {
            return res.status(400).json({ message: "Emotion is required" });
        }

        const entry = await MoodHistory.create({
            user: req.user.id,
            emotion,
            songCount: songCount || 0,
        });

        return res.status(201).json({ message: "Mood entry saved", entry });
    } catch (error) {
        console.error("addMoodEntry error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getMoodHistory = async (req, res) => {
    try {
        const { filter } = req.query;
        const now = new Date();
        let dateFilter;

        if (filter === "week") {
            dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
            dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }

        const entries = await MoodHistory.find({
            user: req.user.id,
            createdAt: { $gte: dateFilter },
        }).sort({ createdAt: -1 }).limit(100);

        return res.status(200).json({ message: "Mood history retrieved", entries });
    } catch (error) {
        console.error("getMoodHistory error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addMoodEntry, getMoodHistory };
