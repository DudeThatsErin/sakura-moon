const connection = require('../../database.js');
const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'statusreport',
    description: 'You can check the status of a previous report you sent.',
    aliases: ['status-report', 'statr', 'reportcheck', 'check-report', 'checkreport'],
    inHelp: 'yes',
    usage: 's.statusreport <messageID>',
    example: 's.statusreport 852197394828230716',
    permissions: '',
    async execute(message, args, client) {

        let messageId = args[0];
        if (messageId < 0) {
            message.reply('Please include the message ID for the report you want to update.')
            return;
        } else {
            const results = await connection.query(
                `SELECT * FROM reports WHERE messageId = ?;`,
                [messageId]
            );
            const guildId = results[0][0].guildId;
            const guilds = client.guilds.cache.find(guild => guild.id === `${guildId}`);
            const guildName = guilds.name;
            const OG = results[0][0].authorId;
            const author = client.users.cache.find(user => user.id === `${OG}`);
            let usr = message.guild.members.cache.get(author);
            const authorUsername = author.username;
            const original = results[0][0].description;
            const avatar = results[0][0].avatar;
            const file = results[0][0].file || 'No file was uploaded';

            const status = results[0][0].stat || 'I have not started working on it yet. I will get to it as soon as I can. Thank you!';

            let report = new Discord.MessageEmbed()
                .setColor('#B3B6B7')
                .setTitle(`This is the current status of your bug report...`)
                .setAuthor(`${authorUsername}`, `${avatar}`)
                .setThumbnail(`${avatar}`)
                .setDescription(`${status}\n\n**This is your original report:**\n${original}\n\n**Did you upload a file?**\n${file}`)
                .addFields({
                    name: 'Developer Name:',
                    value: `${config.developer.username}`
                }, {
                    name: 'Guild Name:',
                    value: `${guildName}`
                }, {
                    name: 'Guild ID:',
                    value: `\`${guildId}\``
                }, {
                    name: 'Original Message ID:',
                    value: `\`${messageId}\``
                }, {
                    name: 'Message Author ID:',
                    value: `\`${OG}\``
                })
                .setFooter('If you don\'t understand this status, please contact the dev on our support server.', config.bot.avatar)

            usr.send(report)
        }

    }
}