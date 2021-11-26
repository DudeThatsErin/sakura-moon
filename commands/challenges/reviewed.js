const Discord = require('discord.js');
const connection = require('../../database.js');
const embd = require('../../config/embed.json');

module.exports = {
    name: 'reviewed',
    description: 'This gives **mods** the ability to review submissions.',
    aliases: ['mark', 'review'],
    usage: 's.reviewed [challenge number] <number of points> [message ID]',
    example: 's.reviewed 1 1 841143871689064448',
    inHelp: 'yes',
    timeout: '25000',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    async execute (message, args, client) {
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
                                `SELECT * FROM Submissions WHERE msgId = ?;`,
                                [msgId]
                            );
                            let user = result[0][0].author;
                            let mess = result[0][0].message;
                            
                            if (result[0][0]?.moderator === undefined) {
                                let mod = client.users.cache.get(result[0][0].moderator) || await client.users.fetch(result[0][0].moderator).catch(() => { });
                                let name = mod.tag;
                                const Author = client.users.cache.get(user) || await client.users.fetch(user).catch(() => { });
                                let icon = message.guild.iconURL();
                                connection.query(
                                    `UPDATE Submissions SET points = ? AND moderator = ? WHERE msgId = ?;`,
                                    [points, moderator, msgId]
                                );

                                let embed = new Discord.MessageEmbed()
                                    .setColor(embd.reviewed)
                                    .setTitle('Your submission has been reviewed!')
                                    .setDescription(`The submission you submitted for ${challengeNo} has been reviewed! Your submission contained the following:\n${mess}\n\nThe moderator that reviewed your submission was:${name}\nYou received \`${points}\` points. Use the \`s.challenge-leaderboard\` command to see where you stand!`)
                                    .setTimestamp()
                                    .setFooter('Good luck!', icon);
                                Author.send({ embeds: [embed] });

                                message.react('👍');
                            }
                            else {
                                message.reply('This submission has already been reviewed. If you need to add more points to this user please use the \`s.add-points\` command.');
                                return;
                            }
                        }
                    }
                }

    }
}