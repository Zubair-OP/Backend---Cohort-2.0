const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    imageFileIds: {
        type: [String],
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const AlbumModel = mongoose.model('Album', albumSchema);

module.exports = AlbumModel;