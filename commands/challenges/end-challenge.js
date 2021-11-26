const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'end-challenge',
    description: 'This gives **mods** the ability to end the challenge that was just being played.',
    aliases: ['endchallenge', 'echallenge', 'exitchallenge', 'exitc', 'over'],
    usage: 's.end-challenge',
    example: 's.end-challenge',
    inHelp: 'yes',
    chlMods: 1,
    timeout: '1000000',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    async execute (message) {
            
            connection.query(
                `DELETE FROM Challenge WHERE guildId = ?;`,
                [message.guild.id]
            );
            connection.query(
                `DELETE FROM ChallengeQ WHERE guildId = ?;`,
                [message.guild.id]
            );
            connection.query(
                `DELETE FROM Submissions WHERE guildId = ?;`,
                [message.guild.id]
            );    

        message.react('✅');

    }
}