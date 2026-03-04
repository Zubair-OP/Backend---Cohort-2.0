const mongoose = require('mongoose');

const BlacklistSchema = new mongoose.Schema({
    token : {
        type : String
    }
}, { timestamps : true });

const BlacklistModel = mongoose.model('Blacklist', BlacklistSchema);

module.exports = BlacklistModel;