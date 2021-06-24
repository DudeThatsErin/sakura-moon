const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'thanks-on',
    description: 'This gives **mods** the ability to turn the Thanks System on.',
    aliases: ['tks-on', 'thx-on', 'thankson', 'thxon', 'tkson', 'txon', 'thnxon', 'thx-on'],
    usage: 's.thanks-on',
    example: 's.thanks-on or s.thxon or s.txon',
    inHelp: 'yes',
    note: 'In order for mods to be able to use this command, someone from the guild has to support the bot on [Patreon](https://www.patreon.com/SakuraMoon).',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    async execute (message, args) {

      const results = await connection.query(
        `SELECT * from Patrons WHERE guildId = ?;`,
        [message.guild.id]
    );
      if(results[0][0] === undefined || results[0][0] === 'undefined') return message.reply('Only patrons have access to use the Challenge System. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.guild.member(message.author).hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {

            await (await connection).query(
                `UPDATE Guilds SET thanks = ? WHERE guildId = ?;`,
                [1, message.guild.id]
            );

            message.channel.send('I have turned on the Thanks System for you. \`s.thanks\` and \`s.thanks-leaderboard\` commands will now work.');

        }
    }
}
