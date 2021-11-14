const connection = require('../../database.js');
const Discord = require('discord.js');

module.exports = {
    name: 'remove-patron',
    description: 'Allows Erin to remove patrons from the database.',
    aliases: ['rp', 'remove-patrons', 'removepatrons', 'removepatron', 'delete-custs', 'remove-cust'],
    inHelp: 'yes',
    usage: 's.removepatrons <guild ID>',
    example: 's.removepatrons 849645937202036757',
    permissions: '',
    note: '',
    ownerOnly: 'yes',
    async execute(message, args, client) {

        let guildId = args[0];

        if (!args[0]) return message.reply('ERIN! INCLUDE THE GUILD ID YOU IDIOT!');

        await (await connection).query(
            `DELETE FROM Patrons WHERE guildId = ?;`,
            [guildId]
        );

        message.reply('I have removed the patron from the database.');

    }
}