const connection = require('../database.js');

module.exports = {
    name: 'update-prefix',
    description: 'Allows **guild owner** to change the bot\'s prefix.',
    aliases: ['upprefix', 'uprefix', 'updateprefix', 'changeprefix', 'change-prefix'],
    usage: '[current prefix]update-prefix [new prefix]',
    example: 's.update-prefix !\nThis will update your prefix to \`!\`.\n**Note:** This *only* changes how commands are used, not how they are displayed within the \`s.help\` command!',
    inHelp: 'yes',
    async execute(message, args, client) { 

        let newPrefix = args[0];
        if (message.member.id === message.guild.ownerID) {
            (await connection).query(
                `UPDATE Guilds SET prefix = ? WHERE guildId = ?;`,
                [newPrefix, message.guild.id]
            );
            message.reply(`I have updated your prefix to \`${newPrefix}\``); // sends successfully & updates in the db.
            client.guildCommandPrefixes.set(message.guild.id, newPrefix);
            console.log(client.guildCommandPrefixes.get(message.guild.id));
        } else {
            message.reply('Only **guild owners** can run this command.');
            return;
        }
    }
}