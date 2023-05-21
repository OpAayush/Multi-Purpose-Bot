const mongoose = require('mongoose');

const selfRolePanelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    messageID: String,
    channelID: String,
    roles: [{
        roleId: String,
        buttonID: String,
        buttonStyle: String,
        buttonType: String,
        buttonLabel: String,
        buttonEmoji: String,
        
    }],
});

module.exports = mongoose.model('SelfRole.Panel', selfRolePanelSchema, 'selfrole.Panel');
