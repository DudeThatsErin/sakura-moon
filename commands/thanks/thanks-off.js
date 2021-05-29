const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'thanks-off',
    description: 'Allows **mods** to turn off the Thanks System. You must run \`s.thanks-on\` first for this command to work.',
    aliases: ['tks-off', 'thx-off', 'toff', 'thanksoff', 'txoff', 'txoff', 'thnxoff', 'thxoff'],
    usage: 's.thanks-off',
    example: 's.thanks-off or s.thxoff or s.txoff',
    inHelp: 'yes',
    async execute (message, args) {

        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!member.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {

            await connection.query(
                `UPDATE Guilds SET thanks = ? WHERE guildId = ?`,
                [0, message.guild.id]
            );

            message.channel.send('I have turned off the Thanks System for you. \`s.thanks\` and \`s.thanks-leaderboard\` commands will no longer work.');
        
        }
    }
}