const connection = require('../../database.js');
const Discord = require('discord.js');

module.exports = {
    name: 'addpatrons',
    description: 'Allows Erin to add guilds to the database.',
    aliases: ['ap', 'add-patrons', 'addpatron', 'add-patron', 'add-custs', 'add-cust'],
    inHelp: 'yes',
    usage: 's.addpatrons <guild ID> <owner ID> <patron level> <owner name>',
    example: 's.addpatrons 849645937202036757 455926927371534346 5 Erin',
    permissions: '',
    note: '',
    ownerOnly: 'yes',
    async execute(message, args, client) {

        let guildId = args[0];
        let owner = args[1];
        let name = args.slice(3).join(" ");
        let level = args[2];

        if (!args[0]) return message.reply('ERIN! INCLUDE THE GUILD ID YOU IDIOT!');

        await (await connection).query(
            `INSERT INTO Patrons (guildId, ownerId, name, level) VALUES(?, ?, ?, ?);`,
            [guildId, owner, name, level]
        );

        message.reply('I have added the patrons to the guild.');

    }
}