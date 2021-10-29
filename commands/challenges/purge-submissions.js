const connection = require('../../database.js');


module.exports = {
    name: 'purge-submissions',
    description: 'This gives **mods** the ability to purge all submissions from the submissions database. *Note:* This does *not* delete them from the channel within discord.',
    aliases: ['purges', 'psubmissions', 'psubs', 'purgesubs', 'deletesubs', 'delete-subs'],
    usage: '++purge-submissions',
    example: '++purge-submissions',
    inHelp: 'yes',
    challengeMods: 'yes',
    modOnly: 'yes',
    userPerms: [''],
    botPerms: [''],
    async execute (message, args) {
            
            connection.query(
                `DELETE FROM Submissions WHERE guildId = ?;`,
                [message.guild.id]
            );
        message.react('✅');


        
    }
}