const mongoose = require('mongoose');

const afkSchema = mongoose.Schema({
    guilds: [{
        guildID: String
    }],
    global: Boolean,
    userID: String,
    reason: String,
    timestamp: Number,
});

module.exports = mongoose.model('afk', afkSchema);