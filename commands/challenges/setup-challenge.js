const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'setup-challenge',
    description: 'This gives **mods** the ability to .',
    aliases: ['challenge-setup', 'setupchallenge', 'challengesetup'],
    usage: 's.setup-challenge <challenge Mod Roles> <participants/players role> <announcements channel ID>',
    example: 's.setupchallenge 751526654781685912 817426310967590943 870828520375455774',
    inHelp: 'yes',
    mods: 1,
    timeout: '1000000',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
    async execute(message, args) {
        let challengeMods = args[0];
        let players = args[1];
        let announcements = args[2];
        //console.log(challengeMods);
        //console.log(players);
        //console.log(announcements);
        //console.log(message.guild.id);
        if (!challengeMods || !players || !announcements) return message.reply('Please make sure to give me all 3 pieces of information I need. Your command should look like this: \`s.setup-challenge <challenge mod role ID> <participants/players role ID> <announcements channel ID>\`.');

        await connection.query(
            `UPDATE Guilds SET chlMod = ? WHERE guildId = ?;`,
            [challengeMods, message.guild.id]
        );

        /*const result = await connection.query(
            `SELECT * FROM Guilds;`
        )
        console.log(result)*/


        await connection.query(
            `INSERT INTO Challenge (guildId, partRoleiD, channelD) VALUES(?,?,?);`,
            [message.guild.id, players, announcements]
        );

        /*const result2 = await connection.query(
            `SELECT * FROM Challenge;`
        )
        console.log(result2)*/

        message.reply('Added!');
    }
}