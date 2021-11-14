const connection = require('../../database.js');
const Discord = require('discord.js');

module.exports = {
    name: 'addguilds',
    description: 'Allows Erin to add guilds to the database.',
    aliases: ['ag', 'add-guilds', 'addguild', 'add-guild'],
    inHelp: 'yes',
    usage: 's.addguilds <guild ID>',
    example: 's.addguilds 849645937202036757',
    permissions: '',
    note: '',
    ownerOnly: 'yes',
    async execute(message, args, client) {

        let guildId = args[0];
        let guild2 = client.guilds.cache.find(guild => guild.id === `${guildId}`);
        let owner = guild2.ownerID;
        let name = guild2.name;
        let region = guild2.region;

        if (!args[0]) return message.reply('ERIN! INCLUDE THE GUILD ID YOU IDIOT!');

        await (await connection).query(
            `INSERT INTO Guilds (guildId, guildName, ownerID, region, auditLog, prefix, thanks) VALUES(?, ?, ?, ?, ?, ?, ?);`,
            [guildId, name, owner, region, 'off', 's.', 'off']
        );

        message.reply('I have added the guilds to the `Guilds` database.');

    }
}