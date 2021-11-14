const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'reviewed',
    description: 'This gives **mods** the ability to review submissions.',
    aliases: ['mark', 'review'],
    usage: 's.reviewed [challenge number] <number of points> [message ID]',
    example: 's.reviewed 1 1 841143871689064448',
    inHelp: 'yes',
    timeout: 100,
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    async execute (message, args) {
                let challengeNo = args[0];
                let points = args[1];
                let msgId = args[2];
                let moderator = message.author.id;

            if (!challengeNo) {
                message.react('❌');
                    message.channel.send('You need to tell me what challenge number you would like to review.');
                    return;
                } else {
                    if (!points) {
                        message.react('❓');
                        message.channel.send('You need to tell me how many points to give the original author of this submission.');
                        return;
                    } else {
                        if (!msgId) {
                            message.react('❓');
                            message.channel.send('You need to include the message ID for the submission you would like to review. Without this I will not know which message to review.');
                            return;
                        } else {
                            connection.query(
                                `UPDATE Submissions SET moderator = ? WHERE msgId = ?;`,
                                [moderator, msgId]
                            );
                            const result = await connection.query(
                                `SELECT author FROM Submissions WHERE msgId = ?;`,
                                [msgId]
                            );
                            let user = result[0][0].author;
                            const Author = message.client.users.cache.get(user);
                            connection.query(
                                `UPDATE Submissions SET points = ? AND moderator = ? WHERE msgId = ?;`,
                                [points, moderator, msgId]
                            );

                            message.react('👍');
                        }
                    }
                }

    }
}