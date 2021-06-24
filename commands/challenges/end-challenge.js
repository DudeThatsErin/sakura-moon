const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'end-challenge',
    description: 'This gives **mods** the ability to end the challenge that was just being played.',
    aliases: ['endchallenge', 'echallenge', 'exitchallenge', 'exitc', 'over'],
    usage: 's.end-challenge',
    example: 's.end-challenge',
    inHelp: 'yes',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    note: 'In order for mods to use this command, someone from the Guild needs to support Sakura Moon on [Patreon](https://www.patreon.com/SakuraMoon) and they need to have one of the following permissions:\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`.',
    async execute (message, args) {

      const results = await connection.query(
        `SELECT * from Patrons WHERE guildId = ?;`,
        [message.guild.id]
    );
      if(results[0][0] === undefined || results[0][0] === 'undefined') return message.reply('Only patrons have access to use the Challenge System. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');        
        let userNames = '';
        let points = '';
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
                        
            await (await connection).query(
                `DELETE FROM Challenge WHERE guildId = ?;`,
                [message.guild.id]
            );
            await (await connection).query(
                `DELETE FROM Challenges WHERE guildId = ?;`,
                [message.guild.id]
            );
            await (await connection).query(
                `DELETE FROM Submissions WHERE guildId = ?;`,
                [message.guild.id]
            );


            /*const top10 = await (await connection).query(
                `SELECT * FROM Submissions WHERE guildId = ? ORDER BY points DESC LIMIT 10;`, 
                [message.guild.id]
            );    */
    

            message.reply('I have deleted everything from the databases and ended the challenge for you!')

        }
    }
}
