const connection = require('../../database.js');

module.exports = {
    name: 'purge-submissions',
    description: 'This gives **mods** the ability to purge all submissions from the submissions database. *Note:* This does *not* delete them from the channel within discord.',
    aliases: ['purges', 'psubmissions', 'psubs', 'purgesubs', 'deletesubs', 'delete-subs'],
    usage: 's.purge-submissions',
    example: 's.purge-submissions',
    inHelp: 'yes',
    timeout: '600000000',
    mods: 1,
    chlMods: 1,
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    async execute (message, args) {
            
            connection.query(
                `DELETE FROM Submissions WHERE guildId = ?;`,
                [message.guild.id]
            );
        message.react('✅');


        
    }
}