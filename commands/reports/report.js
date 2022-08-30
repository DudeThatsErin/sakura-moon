const connection = require('../../database.js');
const bot = require('../../config/bot.json');
const me = require('../../config/dev.json');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config/config.json');

module.exports = {
    name: 'report',
    description: 'You can report problems with the bot to the developers so that they can fix it.',
    aliases: ['reports', 'err', 'error', 'issue', 'issues'],
    usage: `${config.prefix}report <report>`,
    example: `${config.prefix}report The bot is broken!`,
    async execute(message, args, client) {
        let author = message.author.id;
        let usr = message.guild.members.cache.get(author);
        let messageId = message.id;
        let description = args.slice(0).join(' ');
        if (!description && !message.attachments.first()) return message.reply('Please tell me what you would like to report. You can upload a file but please use words as well. A file alone does not tell me very much at all.')
        const channel = client.channels.cache.find(channel => channel.id === bot.reportsChId);
        let authorUsername = message.author.username;
        let avatar = message.author.displayAvatarURL({ dynamic: true });
        const url = message.attachments.first()?.url || 'No';

        const report = new EmbedBuilder()
            .setColor(0x8c1149)
            .setTitle('Oops! A *bug* has appeared!')
            .setAuthor({
                name: authorUsername,
                icon_url: avatar
            })
            .setDescription(`**This is the report:**\n${description}\n\n**Any files uploaded?**\n${url}`)
            .setTimestamp()
            .setFooter({
                text: 'This was all of the info I could grab from the report.',
                icon_url: bot.avatar
            });

        let report2 = new EmbedBuilder()
            .setColor(0x11818C)
            .setTitle(`Your report has been sent to ${me.name} aka ${me.username}!`)
            .setAuthor({ name: authorUsername, icon_url: avatar })
            .setThumbnail(avatar)
            .setDescription(`**This is the report:**\n${description}\n\n**Any files uploaded?**\n${url}`)
            .setTimestamp()
            .setFooter({ text: 'This was all of the information I could grab from the report.', icon_url: bot.avatar });

        try {
            const botPermissionsIn = message.guild.members.me.permissionsIn(channel);
            if (!botPermissionsIn.has(PermissionsBitField.Flags.SendMessages)) return message.author.send(`I can\'t send messages in that channel. I need to have the \`SEND MESSAGES\` permission for that channel. A mod or guild owner will need to update this. If you are seeing this in error, please run the \`${prefix}report\` command.`).catch(err => console.log('err4', err));

            const botPerms = [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
                if (!message.guild.members.me.permissionsIn(channel).has(botPerms)) {
                    message.react('❌');
                    message.author.send('I do not have the necessary permissions for this channel. I need \`Read Message History, View Channel, and Send Messages.\`').catch(err => console.log('err3', err));
                    return;
            }

            const msg = channel.send({ embeds: [report] }).then(message => {
                //console.log('message', message)
                const report3 = new EmbedBuilder()
                    .setColor(0x8c1149)
                    .setTitle('Oops! A *bug* has appeared!')
                    .setAuthor({
                        name: authorUsername,
                        icon_url: avatar
                    })
                    .setDescription(`**This is the report:**\n${description}\n\n**Any files uploaded?**\n${url}`)
                    .addFields(
                        {name: 'This is the message ID for commands:',value: `\`${message.id}\``},
                        {name: 'Use this to mark the report as **In Progress**:', value: `\`${config.prefix}progressreport ${message.id} [progress message here]\``},
                        {name: 'Use this to complete a report (deny or whatever):', value: `\`${config.prefix}completedreport ${message.id} [completed message here]\``}
                    )
                    .setTimestamp()
                    .setFooter({
                        text: 'This was all of the info I could grab from the report.',
                        icon_url: bot.avatar
                    });
                message.edit({ embeds: [report3] });
            }).catch(err => {
                message.react('❌');
                return message.author.send(`I do not have the necessary permissions for this channel. I need \`Read Message History, View Channel, and Send Messages.\` If you are seeing this in error, please send this exact error message to Erin via this form: https://dudethatserin.com/Report-Issues-with-Sakura-Moon-9a1b060cf35044a4a2b26131d576c81f\nError Message:\n\`\`\`${err}\`\`\``).catch(err => console.log('err3', err));
            });

            const reportNo = msg.id;

            report2.addFields({ name: 'Message ID', value: `\`${reportNo}\`` });
            report2.addFields({ name: 'Please save this message ID. Use the following command to check the status of the report in the future:', value: `\`${config.prefix}statusreport ${reportNo}\`` });
            // await connection.query(
            //     `INSERT INTO reports (messageId, authorId, avatar, description, file) VALUES(?, ?, ?, ?, ?);`, [reportNo, author, avatar, description, url]
            // );

            usr.send({ embeds: [report2] }).catch(err => console.log('err1', err));
        } catch(err) {
            return console.log('error', err)
        }


    }
}