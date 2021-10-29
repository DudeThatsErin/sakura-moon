const connection = require('../../database.js');
const Discord = require('discord.js');
const config = require('../../config/config.json');

module.exports = {
    name: 'report',
    description: 'You can report problems with r/CodingHelp to the developers so that they can fix it.',
    aliases: ['reports', 'err', 'error', 'issue', 'issues'],
    inHelp: 'yes',
    usage: '++report <report>',
    example: '++report The bot is broken!',
    userPerms: [''],
    botPerms: [''],
    async execute(message, args, client) {
        let author = message.author.id;
        let usr = message.guild.members.cache.get(author);
        let messageId = message.id;
        let description = args.slice(0).join(' ');
        if (!description && !message.attachments.first()) return message.reply('Please tell me what you would like to report. You can upload a file but please use words as well. A file alone does not tell me very much at all.')
        const channel = client.channels.cache.find(channel => channel.id === config.bot.reportsChId);
        let authorUsername = message.author.username;
        let avatar = message.author.displayAvatarURL({ dynamic: true });
        const url = (message.attachments.first()?.url || 'no');

        let report2 = new Discord.MessageEmbed()
            .setColor('#D4AC0D')
            .setTitle(`Oops! A *bug* has appeared!`)
            .setAuthor(`${authorUsername}`)
            .setThumbnail(`${avatar}`)
            .setDescription(`**This is the report:**\n${description}\n\n**Any files uploaded?**\n${url}`)
            .setTimestamp()
            .setFooter('This was all of the information I could grab from the report.', config.bot.avatar)

        const msg = await channel.send({ embeds: [report2] });

        message.react('✅');
        const reportNo = msg.id;
        report2.addField('Message ID', `\`${reportNo}\``);
        report2.addField('Please save this message ID. Use the following command to check the status of the report in the future:', `\`++statusreport ${reportNo}\``);

        await connection.query(
            `INSERT INTO reports (messageId, authorId, avatar, description, file) VALUES(?, ?, ?, ?, ?);`,
            [reportNo, author, avatar, description, url]
        );

        usr.send({ content: `I have sent your report to ${config.bot.devName}! Thank you!`, embeds: [report2] })
    }
}