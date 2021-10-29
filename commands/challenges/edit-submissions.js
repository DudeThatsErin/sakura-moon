const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'edit-submission',
    description: 'This gives users the ability to edit the submission answers that they previously submitted. If you need your message ID, contact one of the Challenge Moderators and they can get that for you.',
    aliases: ['editsub', 'edit-sub', 'es', 'mc', 'modify-submission', 'modify-sub', 'modifysub', 'edits'],
    usage: '++edit-submission [message ID] [new answer]',
    example: '++edit-submission 841302144727646269 I like pudding!',
    note: 'You are allowed to upload files. Just leave the `[new answer]` field blank and just upload',
    inHelp: 'yes',
    userPerms: [''],
    botPerms: [''],
    async execute(message, args) {

        let msgId = args[0];
        let title = args.slice(1).join(' ');
        let msg = message.id;
        let author = message.author.username;
        let a = message.author.id;

        const results2 = await connection.query(
            `SELECT * FROM Submissions WHERE msgId = ?;`,
            [msgId]
        );
        let athor = results2[0][0].author;
        let reviewed = results[0][0].moderator;

        if (!msgId) {
            message.delete();
            message.channel.send('You need to include your original message ID. If you do not know what this is, reach out to one of our mods, they can provide this to you.');
            return;
        } else {
            if (a !== athor) {
                message.delete();
                message.channel.send(`${author}, You are not the original author/poster of the submission. Only the original author/poster (aka OP) can edit their message. If you are receiving this message in error, please report this.`);
                return;
            }
            if (reviewed !== '0') {
                message.delete();
                message.channel.send(`${author}, Your submission has already been reviewed. I am unable to modify a submission after it has been reviewed by moderators. If this is wrong, please report this. Thanks!`);
                return;
            } else {
                message.attachments.forEach(async attachment => {
                    const url = attachment.url;

                    connection.query(
                        `UPDATE Submissions SET msgId = ?, Message = ?, file = ? WHERE msgId = ?;`,
                        [msg, url, title, msgId]
                    );
                    const newAnswer = title || url;
                    let au = message.author.id;

                    let embed = new Discord.MessageEmbed()
                        .setColor('#c9a066')
                        .setTitle(`I have updated your submission, Thanks ${author}!`)
                        .setDescription(`I have updated your submission to:\n${newAnswer}\n\nYour new message ID is:\n\`${msg}\``)
                        .setFooter('If there is a problem with this, please report it!');

                    message.client.users.cache.get(`${au}`).send({ embeds: [embed] });
                    message.delete();
                });
            }
        }


    }
}