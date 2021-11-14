const Discord = require('discord.js');
const connection = require('../../database.js');
const bot = require('../../config/bot.json');

module.exports = {
    name: 'submit',
    description: 'This is how users can submit answers to the challenge questions.',
    aliases: ['submits', 'answer'],
    usage: 's.submit [challenge number] [answer]',
    example: '\`\`\`++submit 1 ` ` `language\n//code here ` ` `\nadditional information here.\n\`\`\`\nPlease remove the spaces between the backticks before language and after \`//code here\`. If you are submitting a link, please use this format: \`\`\`s.submit 1 https://github.com\`\`\` Meaning keep it all on the same line. Not formatting it this way will cause issues with our system.',
    note: 'Files are accepted! Just leave the `[answer]` field blank when submitting so just type `s.submit [challenge number]` and then upload your file.',
    inHelp: 'yes',
    cooldown: 400,
    note: 'You can now include attachments! If you want to submit with an attachment just run \`s.sumbit [challenge number]\` and attach any files you would like to submit with your submission.',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS'],
    async execute(message, args, client) {

        let msgId = message.id;
        let guildId = message.guild.id;
        let dayNo = args[0];
        let answer = args.slice(1).join(' ') || 'only attachment submitted';

        const isPlay = await connection.query(
            `SELECT player FROM chPlayers WHERE player = ? AND guildId = ?;`,
            [message.author.id, message.guild.id]
        );
        if (isPlay[0][0].player == undefined) {
            message.delete();
            message.channel.send(`Sorry, ${message.author.username}, You are not in the challenge system database. Therefore, you cannot play. If you are receiving this message in error, rest assure that the developer has been notified.`);
            client.users.cache.get(bot.ownerID).send({ content: `${message.author.username} just tried to play in ${message.guild.name}'s challenge system but they are not in the database. The database returned *undefined* for \`${message.author.id}\` in guild ID \`${message.guild.id}\`. This *may* be a possible error, just making you aware that you may want to check the database!'` });
            return;
        }

        const result = await connection.query(
            `SELECT * FROM Submissions WHERE guildId = ?;`,
            [guildId]
        );
        if (result == undefined) {
            message.react('❌');
            message.reply('You already made a submission to this challenge. You may not submit more than one answer per challenge question. If you need to modify your submission, please use the \`s.edit-submission [challenge number] [new answer]\` command. Thank you!');
            return;
        } else {

            let author = message.author.id;
            let tag = message.author.username;

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
                        .setColor('#616169')
                        .setTitle(`Thank you, ${tag}, for submitting your answer for challenge ${dayNo}.`)
                        .setDescription(`The answer you submitted was:\n${answer}\n\nIf you want to modify your answer, please copy and paste this command with your updated answer: \`s.edit-submission ${msgId} [replace this with your new answer]\``)
                        .setFooter(`If you need to modify your answer please run the s.edit-submission command. Thank you!`);
                    message.delete();
                    message.client.users.cache.get(`${author}`).send({ embeds: [embed] });
                }
                message.attachments.forEach(async attachment => {
                    const url = attachment.url;
                    connection.query(
                        `INSERT INTO Submissions (guildId, msgId, author, message, file, challengeNo, moderator, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                        [guildId, msgId, author, answer, url, dayNo, 0, 0]
                    );

                    let embed = new Discord.MessageEmbed()
                        .setColor('#616169')
                        .setTitle(`Thank you, ${tag}, for submitting your answer for challenge ${dayNo}.`)
                        .setDescription(`The answer you submitted was:\n${answer}\n\nThis is the attachment you submitted: ${url}\n\nIf you want to modify your answer, please copy and paste this command with your updated answer: \`++modify-answer ${msgId} [replace this with your new answer]\``)
                        .setFooter(`If you need to modify your answer please run the s.modify-answer command. Thank you!`);
                    message.delete();
                    message.client.users.cache.get(`${author}`).send({ embeds: [embed] });
                });


            }


        }

    }
}