const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'thanks-off',
    description: 'Allows **mods** to turn off the Thanks System. You must run \`s.thanks-on\` first for this command to work.',
    aliases: ['tks-off', 'thx-off', 'toff', 'thanksoff', 'txoff', 'txoff', 'thnxoff', 'thxoff'],
    usage: 's.thanks-off',
    example: 's.thanks-off or s.thxoff or s.txoff',
    inHelp: 'yes',
    cooldown: 0,
    note: 'In order for mods to be able to use this command, someone from the guild has to support the bot on [Patreon](https://www.patreon.com/SakuraMoon).',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
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
                `UPDATE Guilds SET thanks = ? WHERE guildId = ?`,
                [0, message.guild.id]
            );
            await (await connection).query(
                `DELETE FROM Thanks WHERE guildId = ?;`,
                [message.guild.id]
            )

            message.channel.send('I have turned off the Thanks System for you. \`s.thanks\` and \`s.thanks-leaderboard\` commands will no longer work.');
        
        }
    }
}
