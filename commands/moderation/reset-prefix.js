const connection = require('../../database.js');

module.exports = {
    name: 'reset-prefix',
    description: 'Allows **guild owner** to reset the bot\'s prefix to default.',
    aliases: ['resetprefix', 'resrefix', 'restartprefix', 'rp'],
    usage: '[current prefix]reset-prefix',
    example: 's.reset-prefix\nThis will reset your prefix to \`s.\`',
    inHelp: 'yes',
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'ADMINISTRATOR'],
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'ADMINISTRATOR'],
    patreonOnly: 'no',
    note: '',
    async execute(message, args, client) {

        let newPrefix = 's.';
        console.log('oldPrefix: ' + newPrefix);
        if (message.member.id === message.guild.ownerID) {
            (await connection).query( //works
                `UPDATE Guilds SET prefix = ? WHERE guildId = ?;`,
                [newPrefix, message.guild.id]
            );
            message.reply(`I have reset your bot's prefix. Your prefix is now \`${newPrefix}\``); // says this
            client.guildCommandPrefixes.set(message.guild.id, newPrefix); //does not work
            console.log(client.guildCommandPrefixes.get(message.guild.id));
        } else {
            message.reply('Only **guild owners** can run this command.');
            return;
        }
    }
}