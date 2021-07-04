const connection = require('../../database.js');

module.exports = {
    name: 'thanks-on',
    description: 'This gives **mods** the ability to turn the Thanks System on.',
    aliases: ['tks-on', 'thx-on', 'thankson', 'thxon', 'tkson', 'txon', 'thnxon', 'thx-on'],
    usage: 's.thanks-on <channel 1 ID here>|<channel 2 ID here>|<channel 3 ID here>',
    example: 's.thanks-on 856959692516491305|825857005830012938|825857020753739806|852192258156920853',
    inHelp: 'yes',
    note: 'You can have as many channels turned on as you would like. Any channel not listed here will be off, meaning the bot will not auto-respond in those channels. Each channel ID must be spearated by \`|\` which is hte key above your enter key on your keyboard.\nYou must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    async execute(message, args) {

        let channel = args.slice(0).join(" ");

        connection.query(
            `UPDATE Guilds SET thanks = ?, txChannels = ? WHERE guildId = ?;`,
            [1, channel, message.guild.id]
        );

        message.react('✅')
        message.channel.send('I have turned on the Thanks System for you. \`s.thanks\` and \`s.thanks-leaderboard\` commands will now work.');
    }
}