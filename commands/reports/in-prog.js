const connection = require('../../database.js');
const Discord = require('discord.js');
const config = require('../../config/config.json');

module.exports = {
    name: 'progressreport',
    description: 'You can report problems with Sakura Moon to the developers so that they can fix it.**Note:** Images or Files will *not* be accepted. Please be as detailed as possible via text.',
    aliases: ['progress-report', 'pr', 'progreport', 'prgrpt'],
    inHelp: 'yes',
    usage: '++progressreport <report>',
    example: '++progressreport The bot is broken!',
    modOnly: 'yes',
    userPerms: ['MANAGE_MESSAGES'],
    botPerms: ['ADD_REACTIONS', 'VIEW_CHANNEL'],
    async execute(message, args, client) {

        let description = args.slice(1).join(' ');
        if (!args[1]) {
            message.react('❓');
            message.reply('Please include the status Erin, sheesh.')
        }
        const chnnel = client.channels.cache.find(channel => channel.id === config.bot.reportsChId);

        let msgId = args[0];
        if (msgId < 0) {
            message.react('❓');
            message.reply('Please include the message ID for the report you want to update.')
            return;
        } else {
            const results = await (await connection).query(
                `SELECT * FROM reports WHERE messageId = ?;`,
                [msgId]
            );
            const OG = results[0][0].authorId;
            const author = client.users.cache.find(user => user.id === `${OG}`);
            const authorUsername = author.username;
            const original = results[0][0].description;
            const avatar = results[0][0].avatar;

            let report = new Discord.MessageEmbed()
                .setColor('#B3B6B7')
                .setTitle(`Your bug report is being worked on!`)
                .setAuthor(`${authorUsername}`, `${avatar}`)
                .setDescription(`**This is the original report:**\n${original}\n\n**This is the updated status:**\n${description}`)
                .setFooter('If this is incorrect please report this!', config.bot.avatar)


            chnnel.messages.fetch(msgId).then(message => {
                report.addField('Original Message ID:', `\`${msgId}\``)
                report.addField('Message Author ID', `\`${OG}\``);
                if (message) message.edit({ embeds: [report] });
            });

            (await message.client.users.cache.get(`${OG}`)).send({ embeds: [report] });

            message.react('✅');

            await connection.query(
                `UPDATE reports SET moderator = ? AND stat = ? WHERE messageId = ?;`,
                [config.devId, description, msgId]
            );
        }

    }
}