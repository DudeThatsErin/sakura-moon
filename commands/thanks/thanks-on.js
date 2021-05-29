const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'thanks-on',
    description: 'This gives **mods** the ability to turn the Thanks System on.',
    aliases: ['tks-on', 'thx-on', 'thankson', 'thxon', 'tkson', 'txon', 'thnxon', 'thx-on'],
    usage: 's.thanks-on',
    example: 's.thanks-on or s.thxon or s.txon',
    inHelp: 'yes',
    async execute (message, args) {
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!member.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {

            await connection.query(
                `INSERT INTO Guilds (thanks) VALUES (?) WHERE guildId = ?;`,
                [1, message.guild.id]
            );

            message.channel.send('I have turned on the Thanks System for you. \`s.thanks\` and \`s.thanks-leaderboard\` commands will now work.');

        }
    }
}