const connection = require('../../database.js');
const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'report',
    description: 'You can report problems with Sakura Moon to the developers so that they can fix it.**Note:** Images or Files will *not* be accepted. Please be as detailed as possible via text.',
    aliases: ['reports', 'err', 'error', 'issue', 'issues'],
    inHelp: 'yes',
    usage: 's.report <report>',
    example: 's.report The bot is broken!',
    permissions: '',
    async execute(message, args, client) {
        let author = message.author.id;
        let usr = message.guild.members.cache.get(author);
        let guildName = message.guild.name;
        let guild = message.guild.id;
        let messageId = message.id;
        let description = args.slice(0).join(' ');
        if (!description && !message.attachments.first()) return message.reply('Please tell me what you would like to report. You can upload a file but please use words as well. A file alone does not tell me very much at all.')
        const channel = client.channels.cache.find(channel => channel.id === config.bot.reportsChId);
        let authorUsername = message.author.username;
        let avatar = message.author.displayAvatarURL({
            dynamic: true
        });

        const url = 'no' || message.attachments.first().url;

        let report2 = new Discord.MessageEmbed()
            .setColor('#2980B9')
            .setTitle(`WE HAVE A BUG!`)
            .setAuthor(`${authorUsername}`)
            .setThumbnail(`${avatar}`)
            .setDescription(`**This is the report:**\n\n${description}\n\n**Any files uploaded?**\n${url}`)
            .addFields({
                name: 'Guild Name:',
                value: `${guildName}`
            }, {
                name: 'Guild ID:',
                value: `\`${guild}\``
            }, {
                name: 'Message ID:',
                value: `\`${messageId}\``
            }, {
                name: 'Message Author ID:',
                value: `\`${author}\``
            })
            .setFooter('This was all of the information I could grab from the report.', config.bot.avatar)

        await channel.send(report2);
        message.react('✅');
        usr.send(`I have sent your report to the dev! Thank you! Please save this message ID as you can use it to check the status of this report in the future: \`${messageId}\`.\nTo check the status you can copy and paste this:\n\`s.statusreport ${messageId}\``)

        await connection.query(
            `INSERT INTO reports (messageId, guildId, authorId, avatar, description, file) VALUES(?, ?, ?, ?, ?, ?);`,
            [messageId, guild, author, avatar, description, url]
        );
    }
}