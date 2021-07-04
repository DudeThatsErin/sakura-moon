const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'mod-check-submissions',
    description: 'This allows **mods** to check who has submitted a response.',
    aliases: ['mcs', 'mcksubs', 'mck-subs', 'modchecksubmissions'],
    usage: 's.mod-check-submissions [challenge number]',
    example: 's.mod-check-submissions 1',
    inHelp: 'yes',
    note: 'You must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    patreonOnly: 'yes',
    async execute(message, args) {
        let name = message.author.id;
        let challengeNo = args[0];
        if (!challengeNo) {
            message.react('❌');
            message.channel.send('Please include the challenge number you want to check the submissions for. Thank you!');
            return;
        } else {
            const result2 = await (await connection).query(
                `SELECT * FROM Challenge WHERE guildId = ? AND challengeNo = ?;`,
                [message.guild.id, challengeNo]
            );
            const number = result2[0][0].challengeNo;
            const question = result2[0][0].title;
            let embed = new Discord.MessageEmbed()
                .setColor('#3fa066')
                .setTitle(`This is the question that was asked during Challenge ${number}`)
                .setDescription(`${question}`)
                .setFooter('If this is not right, please report it!');
            message.channel.send(`📨 I have sent you a private message!`)
            message.client.users.cache.get(`${name}`).send(embed);

            const result = await (await connection).query(
                `SELECT * FROM Submissions WHERE guildId = ? AND challengeNo = ?;`,
                [message.guild.id, challengeNo]
            );

            for (const row of result[0]) {
                const Members = row.author;
                const Author = await message.client.users.fetch(Members).catch(err => {
                    console.log(err);
                });
                const username = Author.username;
                const Submissions = row.message;
                const dayNo = row.challengeNo;
                const moderator = row.moderator;
                const msgId = row.msgId;
                const modname = await message.client.users.fetch(moderator).catch(err => {
                    console.log(err);
                });


                // notDefined Embed
                const notDefined = new Discord.MessageEmbed()
                    .setColor('#3e5366')
                    .setTitle(`The submission by ${username} for Challenge ${dayNo} has not been reviewed yet.`)
                    .setDescription(`Their submission is as follows:\n${Submissions}\n\nTheir message ID is as follows: \`${msgId}\``)
                    .setFooter('If there is a problem with this, please report this!');

                // Defined Embed
                const defined = new Discord.MessageEmbed()
                    .setColor('#d4a066')
                    .setTitle(`The submission by ${username} for Challenge ${dayNo} has been reviewed.`)
                    .setDescription(`Their submission is as follows:\n${Submissions}\n\nTheir message ID is as follows: \`${msgId}\`\n\nThe moderator that reviewed it was: ${modname}.`)
                    .setFooter('If there is a problem with this, please report this!');

                if (moderator) {
                    message.react('✅');
                    message.client.users.cache.get(`${name}`).send(defined);
                } else {
                    message.react('✅');
                    message.client.users.cache.get(`${name}`).send(notDefined);
                }
            }
        }
    }
}