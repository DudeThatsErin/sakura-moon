const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'thanks-on',
    description: 'This gives **mods** the ability to turn the Thanks System on.',
    aliases: ['tks-on', 'thx-on', 'thankson', 'thxon', 'tkson', 'txon', 'thnxon', 'thx-on'],
    usage: 's.thanks-on [channel ID]|[channel ID]|[channel ID]',
    example: 's.thanks-on or s.thxon or s.txon',
    inHelp: 'yes',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    async execute(message, args) {

        let channel = args.slice(0).join(" ");
        console.log(channel) // logs the same as args[0]

        connection.query(
            `UPDATE Guilds SET thanks = ?, txChannels = ? WHERE guildId = ?;`,
            [1, channel, message.guild.id]
        );

        message.channel.send('I have turned on the Thanks System for you for the Channel IDs you have provided. \`s.thanks\` and \`s.thanks-leaderboard\` commands will now work.');

        //message.channel.send(`This is the channel ID you provided: ${channel}`)

    }
}