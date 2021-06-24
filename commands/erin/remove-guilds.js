const connection = require('../../database.js');
const Discord = require('discord.js');

module.exports = {
    name: 'removeguilds',
    description: 'Allows Erin to remove guilds from the database.',
    aliases: ['rg', 'remove-guilds', 'removeguild', 'remove-guild', 'deleteguilds', 'deleteguild', 'delete-guilds', 'delete-guild'],
    inHelp: 'yes',
    usage: 's.removeguilds <guild ID>',
    example: 's.removeguilds 849645937202036757',
    note: '',
    ownerOnly: 'yes',
    permissions: '',
    async execute(message, args, client) {

        let guildId = args[0];

        if (!args[0]) return message.reply('ERIN! INCLUDE THE GUILD ID YOU IDIOT!');

        await (await connection).query(
            `DELETE FROM Guilds WHERE guildId = ?;`,
            [guildId]
        );

        message.reply('I have removed the guilds from the `Guilds` database.');

    }
}