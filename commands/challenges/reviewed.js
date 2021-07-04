const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'reviewed',
    description: 'This gives **mods** the ability to review submissions.',
    aliases: ['mark', 'review'],
    usage: 's.reviewed [challenge number] <number of points> [message ID]',
    example: 's.reviewed 1 1 841143871689064448',
    inHelp: 'yes',
    note: 'You must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    patreonOnly: 'yes',
    async execute(message, args) {

        let challengeNo = args[0];
        let points = args[1];
        let msgId = args[2];
        let moderator = message.author.id;

        if (!challengeNo) {
            message.channel.send('You need to tell me what challenge number you would like to review.');
            return;
        } else {
            if (!points) {
                message.channel.send('You need to tell me how many points to give the original author of this submission.');
                return;
            } else {
                if (!msgId) {
                    message.channel.send('You need to include the message ID for the submission you would like to review. Without this I will not know which message to review.');
                    return;
                } else {
                    connection.query(
                        `UPDATE Submissions SET moderator = ? WHERE msgId = ? AND guildId = ?;`,
                        [moderator, msgId, message.guild.id]
                    );
                    const result = await (await connection).query(
                        `SELECT suthor FROM Submissions WHERE msgId = ? AND guildId = ?;`,
                        [msgId, message.guild.id]
                    );
                    let user = result[0][0].author;
                    const Author = message.client.users.cache.get(user);
                    connection.query(
                        `INSERT INTO Submissions (guildId, author, points, challengeNo) VALUES (?, ?, ?, ?);`,
                        [message.guild.id, user, points, challengeNo]
                    );

                    message.channel.send(`I have given ${Author} ${points} point(s) and marked that submission as reviewed! Thank you!`);
                }
            }
        }

    }
}