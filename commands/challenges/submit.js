const Discord = require('discord.js');
const connection = require('../../database.js');
const bot = require('../../config/bot.json');
const embd = require('../../config/embed.json');

module.exports = {
    name: 'submit',
    description: 'This is how users can submit answers to the challenge questions.',
    aliases: ['submits', 'answer'],
    usage: 's.submit [challenge number] [answer]',
    example: '\`\`\`++submit 1 ` ` `language\n//code here ` ` `\nadditional information here.\n\`\`\`\nPlease remove the spaces between the backticks before language and after \`//code here\`. If you are submitting a link, please use this format: \`\`\`s.submit 1 https://github.com\`\`\` Meaning keep it all on the same line. Not formatting it this way will cause issues with our system.',
    note: 'Files are accepted! Just leave the `[answer]` field blank when submitting so just type `s.submit [challenge number]` and then upload your file.',
    inHelp: 'yes',
    timeout: '600000000',
    note: 'You can now include attachments! If you want to submit with an attachment just run \`s.sumbit [challenge number]\` and attach any files you would like to submit with your submission.',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS'],
    async execute(message, args, client) {

        let msgId = message.id;
        let guildId = message.guild.id;
        let dayNo = args[0];
        let answer = args.slice(1).join(' ') || 'only attachment submitted';
        let me = client.users.cache.get(bot.ownerID) || await client.users.fetch(bot.ownerID).catch(() => { });

        const result = await connection.query(
            `SELECT author FROM Submissions WHERE guildId = ? and challengeNo = ?;`,
            [guildId, dayNo]
        );
        if (result[0][0].author == message.author.id) {
            message.react('❌');
            message.reply('You already made a submission to this challenge. You may not submit more than one answer per challenge question. If you need to modify your submission, please use the \`s.edit-submission [challenge number] [new answer]\` command. Thank you!');
            return;
        } else {

            let author = message.author.id;
            let tag = message.author.username;
            let authorSend = client.users.cache.get(a) || await client.users.fetch(a).catch(() => { });

            if (!dayNo) {
                message.react('❌');
                message.reply('Please include the challenge number you are submitting your answer to.');
                return;
            } else {
                if (message.attachments.size === 0) {
                    connection.query(
                        `INSERT INTO Submissions (guildId, msgId, author, message, challengeNo, moderator, points) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                        [guildId, msgId, author, answer, dayNo, 0, 0]
                    );

                    let embed = new Discord.MessageEmbed()
                        .setColor(embd.submit)
                        .setTitle(`Thank you, ${tag}, for submitting your answer for challenge ${dayNo}.`)
                        .setDescription(`The answer you submitted was:\n${answer}\n\nIf you want to modify your answer, please copy and paste this command with your updated answer: \`s.edit-submission ${msgId} [replace this with your new answer]\``)
                        .setFooter(`If you need to modify your answer please run the s.edit-submission command. Thank you!`);
                    message.delete();
                    authorSend.send({ embeds: [embed] });
                }
                message.attachments.forEach(async attachment => {
                    const url = attachment.url;
                    connection.query(
                        `INSERT INTO Submissions (guildId, msgId, author, message, file, challengeNo, moderator, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                        [guildId, msgId, author, answer, url, dayNo, 0, 0]
                    );

                    let embed = new Discord.MessageEmbed()
                        .setColor(embd.submit)
                        .setTitle(`Thank you, ${tag}, for submitting your answer for challenge ${dayNo}.`)
                        .setDescription(`The answer you submitted was:\n${answer}\n\nThis is the attachment you submitted: ${url}\n\nIf you want to modify your answer, please copy and paste this command with your updated answer: \`++modify-answer ${msgId} [replace this with your new answer]\``)
                        .setFooter(`If you need to modify your answer please run the s.modify-answer command. Thank you!`);
                    message.delete();
                    authorSend.send({ embeds: [embed] });
                });


            }


        }

    }
}