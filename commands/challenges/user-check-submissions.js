const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'user-check-submissions',
    description: 'This allows users to check see what submissions that they have made and provides them with their message ID.',
    aliases: ['ucs', 'ucksubs', 'uck-subs', 'userchecksubmissions'],
    usage: 's.user-check-submissions',
    example: 's.user-check-submissions',
    inHelp: 'yes',
    timeout: '450000',
    players: 1,
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
    async execute (message, args, client) {
        let name = message.author.id;
        let nameSend = client.users.cache.get(name) || await client.users.fetch(name).catch(() => {});

        const result = await connection.query(
            `SELECT * FROM Submissions WHERE guildId = ? AND author = ?;`,
            [message.guild.id, name]
        );

        for (const row of result[0]){
            const Submissions = row.message || 'No message included with this submission.';
            const dayNo = row.challengeNo;
            const moderator = row.moderator;
            const msgId = row.msgId;
            
            const attachment = row.file || 'No attachment included for this submission';

            if (moderator === '0') {
                // notDefined Embed
                const notDefined = new Discord.MessageEmbed()
                    .setColor('#3e5366')
                    .setTitle(`The submission for Challenge ${dayNo} has not been reviewed yet.`)
                    .setDescription(`The submission is as follows:\n${Submissions}\n\nYou had this attachment:\n${attachment}\n\nThe message ID is as follows: \`${msgId}\`\n\nIf you want to modify your answer, please copy and paste this command with your updated answer:\n\`s.edit-submission ${msgId} [replace this with your new answer]\``)
                    .setFooter('If there is a problem with this, please report this!');
               nameSend.send({ embeds: [notDefined] });
                message.react('✅');
            } else {
                const modname = client.users.cache.get(moderator) || await message.client.users.fetch(moderator).catch(() => {});
                // Defined Embed
                const defined = new Discord.MessageEmbed()
                    .setColor('#d4a066')
                    .setTitle(`The submission for Challenge ${dayNo} has been reviewed.`)
                    .setDescription(`The submission is as follows:\n${Submissions}\n\nYou had this attachment:\n${attachment}\n\nThe message ID is as follows: \`${msgId}\`\n\nThe moderator that reviewed it was: ${modname}.\n\nThe moderator that reviewed it was: ${modname}.\n\nYou can no longer edit your submission as it has already been reviewed. If you need to modify it, contact the moderators.`)
                    .setFooter('If there is a problem with this, please report this!');
                
                nameSend.send({ embeds: [defined] });
                message.react('✅');
            }
        }
    }
}