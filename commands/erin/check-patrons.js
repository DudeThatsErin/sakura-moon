const connection = require('../../database.js');
const Discord = require('discord.js');

module.exports = {
    name: 'checkpatrons',
    description: 'Allows Erin to check patrons in the database.',
    aliases: ['check-patrons', 'check-custs', 'check-cust'],
    inHelp: 'yes',
    usage: 's.checkpatrons',
    example: 's.checkpatrons',
    permissions: '',
    note: '',
    ownerOnly: 'yes',
    async execute(message, args, client) {


        const result = await (await connection).query(
            `SELECT * FROM Patrons;`
        );

        message.channel.send('These are all of your current patrons:');
        for (const row of result[0]) {
            const Members = row.ownerId; // works
            const name = await client.users.cache.get(`${Members}`); // works
            const tag = name.username;
            const gld = row.guildId;
            const guildName = await client.guilds.cache.get(`${gld}`).name;
            const patronNo = row.patronNo;
            message.channel.send(`${patronNo}. ${tag} in ${guildName} - \`${gld}\``)
        }

    }
}