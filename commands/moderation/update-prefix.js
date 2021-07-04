const connection = require('../../database.js');

module.exports = {
    name: 'update-prefix',
    description: 'Allows **guild owner** to change the bot\'s prefix.',
    aliases: ['upprefix', 'uprefix', 'updateprefix', 'changeprefix', 'change-prefix'],
    usage: '[current prefix]update-prefix [new prefix]',
    example: 's.update-prefix !\nThis will update your prefix to \`!\`.',
    inHelp: 'yes',
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'ADMINISTRATOR'],
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'ADMINISTRATOR'],
    patreonOnly: 'no',
    note: '',
    async execute(message, args, client) {

        let newPrefix = args[0];
        if (message.member.id === message.guild.ownerID) {
            (await connection).query(
                `UPDATE Guilds SET prefix = ? WHERE guildId = ?;`,
                [newPrefix, message.guild.id]
            );
            message.reply(`I have updated your prefix to \`${newPrefix}\``); // sends successfully & updates in the db.
            client.guildCommandPrefixes.set(message.guild.id, newPrefix);
        } else {
            message.reply('Only **guild owners** can run this command.');
            return;
        }
    }
}