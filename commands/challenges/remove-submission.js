const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'remove-submissions',
    description: 'This allows **mods** to remove responses to challenges.',
    aliases: ['rs', 'rmsubs', 'rm-subs', 'removesubmissions', 'removesubmission', 'rmsub'],
    usage: 's.remove-submissions [message ID]',
    example: 's.remove-submissions 841301824115965952',
    inHelp: 'yes',
    timeout: '45000',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    challengeMods: 'yes',
    async execute (message, args) {
        let name = message.author.id;
        const modname = client.users.cache.get(name) || await message.client.users.fetch(name).catch(err => {console.log(err);});
        let submission = args[0];

        if (!submission) {
            message.react('❌');
                message.channel.send('Please include the message ID of the submission you want to remove. Thank you!');
                return;
            } else {
                const results = await connection.query(
                    `SELECT * FROM Submissions WHERE msgId = ?;`,
                    [submission]
                )
                    const player = results[0][0].author;
                    const user = client.users.cache.get(player) || await message.client.users.fetch(player).catch(err => {console.log(err);});
                    const username = user.username;
                    const Submissions = results[0][0].message;
                    const dayNo = results[0][0].challengeNo;

                    const embed = new Discord.MessageEmbed()
                        .setColor('#d4a066')
                        .setTitle(`The submission by ${username} for Challenge ${dayNo} has been removed.`)
                        .setDescription(`Their submission is as follows:\n${Submissions}\n\nThe moderator that removed it was: ${modname}.`)
                        .setFooter('If there is a problem with this, please report this!');

                message.channel.send({ embeds: [embed] });

                        await connection.query(
                            `DELETE FROM Submissions WHERE msgId = ?;`,
                            [submission]
                        );
                }
                }
}