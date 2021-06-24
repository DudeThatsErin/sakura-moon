const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'reviewed',
    description: 'This gives **mods** the ability to review submissions.',
    aliases: ['mark', 'review'],
    usage: 's.reviewed [challenge number] <number of points> [message ID]',
    example: 's.reviewed 1 1 841143871689064448',
    inHelp: 'yes',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    note: 'In order for mods to use this command, someone from the Guild needs to support Sakura Moon on [Patreon](https://www.patreon.com/SakuraMoon) and they need to have one of the following permissions:\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`.',
    async execute (message, args) {
      const results = await connection.query(
        `SELECT * from Patrons WHERE guildId = ?;`,
        [message.guild.id]
    );
      if(results[0][0] === undefined || results[0][0] === 'undefined') return message.reply('Only patrons have access to use the Challenge System. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
                let challengeNo = args[0];
                let points = args[1];
                let msgId = args[2];
                let moderator = message.author.id;

                if(!challengeNo) {
                    message.channel.send('You need to tell me what challenge number you would like to review.');
                    return;
                } else {
                    if(!points) {
                        message.channel.send('You need to tell me how many points to give the original author of this submission.');
                        return;
                    } else {
                        if(!msgId) {
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
}
