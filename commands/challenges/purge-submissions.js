const connection = require('../../database.js');

module.exports = {
    name: 'purge-submissions',
    description: 'This gives **mods** the ability to purge all submissions from the submissions database.',
    aliases: ['purges', 'psubmissions', 'psubs', 'purgesubs', 'deletesubs', 'delete-subs'],
    usage: 's.purge-submissions',
    example: 's.purge-submissions',
    inHelp: 'yes',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    note: 'This does *not* delete them from the channel within discord.\nIn order for mods to use this command, someone from the Guild needs to support Sakura Moon on [Patreon](https://www.patreon.com/SakuraMoon) and they need to have one of the following permissions:\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`.',
    async execute (message, args) {

      const results = await connection.query(
        `SELECT * from Patrons WHERE guildId = ?;`,
        [message.guild.id]
    );
      if(results[0][0] === undefined || results[0][0] === 'undefined') return message.reply('Only patrons have access to use the Challenge System. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
            
            await (await connection).query(
                `DELETE FROM Submissions WHERE guildId = ?;`,
                [message.guild.id]
            );
            message.reply('I have deleted all of the submissions from the submissions database. If you would like to remove them from the Discord Channel, you can run \`s.purge [number 2-100]\` in that channel.');


        }    

    }
}
