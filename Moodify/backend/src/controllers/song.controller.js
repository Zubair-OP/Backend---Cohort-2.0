const songModel = require("../models/songs.model");
const storageService = require("../services/storage.services")
const id3 = require("node-id3");

const uploadSong = async (req, res) => {
    try {
        const { mood } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "Song file is required" });
        }

        const buffer = req.file.buffer;
        const metadata = id3.read(buffer);
        const title = metadata.title || "Unknown Title";

        const songUploadPromise = storageService.uploadFile(buffer, title + ".mp3", "/cohort-2/moodify/songs");
        
        let posterUploadPromise = Promise.resolve(null);
        if (req.image && req.image.buffer) {
            posterUploadPromise = storageService.uploadFile(req.image.buffer, title + ".jpeg", "/cohort-2/moodify/posters");
        } else if (metadata.image && metadata.image.imageBuffer) {
            posterUploadPromise = storageService.uploadFile(metadata.image.imageBuffer, title + ".jpeg", "/cohort-2/moodify/posters");
        }

        const [songResult, posterResult] = await Promise.all([
            songUploadPromise,
            posterUploadPromise
        ]);

        const songUrl = songResult.url;
        const posterUrl = posterResult ? posterResult.url : "https://via.placeholder.com/150";

        const newSong = await songModel.create({
            title,
            mood,
            url: songUrl,
            posterUrl
        });

        return res.status(201).json({
            message: "Song uploaded successfully",
            song: newSong
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


const getSongsByMood = async (req, res) => {
    const { mood } = req.query;

    const songs = await songModel.find({ mood });

    return res.status(200).json({
        message: "Songs retrieved successfully",
        songs
    });
}

module.exports = {
    uploadSong,
    getSongsByMood
}