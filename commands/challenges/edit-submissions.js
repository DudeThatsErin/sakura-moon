const Discord = require('discord.js');
const connection = require('../../database.js');
const embd = require('../../config/embed.json');
const bot = require('../../config/bot.json');

module.exports = {
    name: 'edit-submission',
    description: 'This gives users the ability to edit the submission answers that they previously submitted. If you need your message ID, contact one of the Challenge Moderators and they can get that for you.',
    aliases: ['editsub', 'edit-sub', 'es', 'mc', 'modify-submission', 'modify-sub', 'modifysub', 'edits', 'editsubmission'],
    usage: 's.edit-submission [message ID] [new answer]',
    example: 's.edit-submission 841302144727646269 I like pudding!',
    note: 'You are allowed to upload files.',
    inHelp: 'yes',
    timeout: '30000',
    chlMods: 1,
    mods: 1,
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
    async execute(message, args, client) {

        let msgId = args[0];
        let title = args.slice(1).join(' ');
        let msg = message.id;
        let author = message.author.username;
        let a = message.author.id;
        let authorSend = client.users.cache.get(a) || await client.users.fetch(a).catch(() => {})
        let me = client.users.cache.get(bot.ownerID) || await client.users.fetch(bot.ownerID).catch(() => { });

        const results2 = await connection.query(
            `SELECT * FROM Submissions WHERE msgId = ?;`,
            [msgId]
        );
        if (results2[0][0]?.author == undefined) {
            message.react('❌');
            message.reply('That is not the right message ID you provided. Please check the ID and run this again.');
            /* ERIN EMBEDS */
            const ownerName = message.guild.ownerID;
            let embed1 = new Discord.MessageEmbed()
                .setColor(embd.modEmbed)
                .setTitle('Edit Submission')
                .setThumbnail(message.guild.iconURL())
                .setDescription(`You *may* need to take a look at the \`edit-submission.js\` file or the [database](https://31.220.21.25:8888/phpmyadmin/index.php) because a user was having an issue with updating their submission. More information is below.`)
                .addFields(
                    {
                        name: 'User\'s Info:',
                        value: `${message.author} - ${message.author.username} - ${message.author.tag} - \`${message.author.id}\``
                    },
                    {
                        name: 'Message Content:',
                        value: `${message.content}`
                    },
                    {
                        name: `Guild Info:`,
                        value: `${message.guild.name} - \`${message.guild.id}\` - ${ownerName} - \`${message.guild.ownerId}\``
                    },
                    {
                        name: 'Error Message:',
                        value: `That is not the right message ID you provided. Please check the ID and run this again. \`results2[0][0]\` is *undefined* with this ID. Please check the SQL code here:\`\`\`sql\nSELECT * FROM Submissions WHERE msgId = ${msgId};\`\`\``
                    }
                )
                .setTimestamp()
                .setFooter('CHECK EDIT SUBMISSION FILE OR DB', embd.footericon);
            if (message.attachments.size !== 0) {
                message.attachments.forEach(async attachment => {
                    const url = attachment.url;
                    embed1.addFields(
                        {
                            name: 'Submission Attachment:',
                            value: url
                        },
                    );
                });
            }
            me.send({ embeds: [embed1] });
            return;
        }
        let athor = results2[0][0].author;
        let reviewed = results2[0][0].moderator;

        if (!msgId) {
            message.delete();
            message.reply('You need to include your original message ID. If you do not know what this is, reach out to one of our mods, they can provide this to you.');
            return;
        } else {
            if (a !== athor) {
                message.delete();
                message.reply(`You are not the original author/poster of the submission. Only the original author/poster (aka OP) can edit their message. If you are receiving this message in error, please report this.`);
                return;
            }
            if (reviewed !== '0') {
                message.delete();
                message.reply(`Your submission has already been reviewed. I am unable to modify a submission after it has been reviewed by moderators. If this is wrong, please report this with the \`s.report\` command. Thanks!`);
                return;
            } else {
                if (message.attachments === true) { // if the message includes an attachment.
                    message.attachments.forEach(async attachment => { // if it has an attachment...
                        const url = attachment.url;

                        connection.query(
                            `UPDATE Submissions SET msgId = ?, Message = ?, file = ? WHERE msgId = ?;`,
                            [msg, url, title, msgId]
                        );
                        const newAnswer = title;
                        const file = url;

                        let embed = new Discord.MessageEmbed()
                            .setColor(embd.upSubmit)
                            .setTitle(`I have updated your submission, Thanks ${author}!`)
                            .setDescription(`I have updated your submission to:\n${newAnswer}\nFile uploaded:\n${file}\n\nYour new message ID is:\n\`${msg}\`\n\nIf you want to modify your answer, please copy and paste this command with your updated answer:\n\`s.edit-submission ${msg} [replace this with your new answer]\``)
                            .setFooter('If there is a problem with this, please report it!', embd.footericon);

                        authorSend.send({ embeds: [embed] });
                        message.delete();
                    });
                } else { // message does NOT have an attachment.
                    connection.query(
                        `UPDATE Submissions SET msgId = ?, message = ? WHERE msgId = ?;`,
                        [msg, title, msgId]
                    );
                    const newAnswer = title;

                    let embed = new Discord.MessageEmbed()
                        .setColor(embd.upSubmit)
                        .setTitle(`I have updated your submission, Thanks ${author}!`)
                        .setDescription(`I have updated your submission to:\n${newAnswer}\n\nYour new message ID is:\n\`${msg}\`\n\nIf you want to modify your answer, please copy and paste this command with your updated answer:\n\`s.edit-submission ${msg} [replace this with your new answer]\``)
                        .setFooter('If there is a problem with this, please report it!', embd.footericon);

                    authorSend.send({ embeds: [embed] });
                    message.delete();
                }
            }
        }


    }
}