const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'end-challenge',
    description: 'This gives **mods** the ability to end the challenge that was just being played.',
    aliases: ['endchallenge', 'echallenge', 'exitchallenge', 'exitc', 'over'],
    usage: 's.end-challenge',
    example: 's.end-challenge',
    inHelp: 'yes',
    note: 'You must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    patreonOnly: 'yes',
    async execute(message, args) {


        let userNames = '';
        let points = '';

        await connection.query(
            `DELETE FROM Challenge WHERE guildId = ?;`,
            [message.guild.id]
        );
        await connection.query(
            `DELETE FROM Challenges WHERE guildId = ?;`,
            [message.guild.id]
        );
        await connection.query(
            `DELETE FROM Submissions WHERE guildId = ?;`,
            [message.guild.id]
        );


        /*const top10 = await (await connection).query(
            `SELECT * FROM Submissions WHERE guildId = ? ORDER BY points DESC LIMIT 10;`, 
            [message.guild.id]
        );    */


        message.react('✅');
        message.reply('I have deleted everything from the databases and ended the challenge for you!')
    }
}