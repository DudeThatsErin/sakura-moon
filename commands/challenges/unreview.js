const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'unreview',
    description: 'This allows **mods** to mark a submission as unreviewed.',
    aliases: ['unreviewed', 'notreviewed', 'noreview', 'not-reviewed', 'no-review'],
    usage: 's.unreview <message ID>',
    inHelp: 'yes',
    chlMods: 1,
    mods: 1,
    example: 's.unreview 850726247050903562',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    async execute(message, args, client) {

        let msgId = args[0];
        if (!msgId) return message.reply('You need to include the message ID for the message you want to remove points from.');
        const results = await connection.query(
            `SELECT * FROM Submissions WHERE msgId = ?;`,
            [msgId]
        );
        if (results[0][0]?.moderator === undefined) return message.reply('This message has not been reviewed yet. I can only mark submissions as unreviewed if they were already reviewed.');
        let player = results[0][0].author;
        let playerID = client.users.cache.get(player) || await message.client.users.fetch(player).catch(err => { console.log(err); });
        let playerName = playerID.username;

            connection.query(
                `UPDATE Submissions SET moderator = ?, points = ? WHERE msgId = ?;`,
                [0, null, msgId]
            );
            message.channel.send({ content: `I have marked ${playerName}'s submission as unreviewed. They can now modify their submission if they need to.` });

    }
}