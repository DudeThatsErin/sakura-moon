const discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'setup-sugg',
    description: 'Sets up and enables the suggestion system. Creates the channels and categories needed. **YOU** need to set the permissions of the channels.',
    userPerms: ['MANAGE_MESSAGES', 'KICK_USERS'],
    botPerms: ['MANAGE_CHANNELS', 'MANAGE_ROLES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES'],
    inHelp: 'yes',
    execute(message, args, client) {
        
    }
}