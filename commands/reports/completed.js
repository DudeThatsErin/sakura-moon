const connection = require('../../database.js');
const Discord = require('discord.js');
const config = require('../../config/config.json');

module.exports = {
    name: 'completedreport',
    description: 'This allows Erin to mark bug reports as completed and delete them from the channel.',
    aliases: ['completed-report', 'creport', 'donereport', 'done-report'],
    inHelp: 'yes',
    usage: '++completedreport <message ID> <description>',
    example: '++completedreport 852197394828230716 The bot is broken!',
    modOnly: 'yes',
    userPerms: ['MANAGE_MESSAGES'],
    botPerms: ['ADD_REACTIONS', 'VIEW_CHANNEL', 'MANAGE_MESSAGES'],
    async execute(message, args, client) {

        let description = args.slice(1).join(' ');
        if (!description) {
            message.react('❓');
            message.reply('Please include the status Erin, sheesh.')
            return;
        }
        const channel = client.channels.cache.find(channel => channel.id === config.bot.reportsChId);

        let messageId = args[0];
        if (messageId < 0) {
            message.react('❌');
            message.reply('Please include the message ID for the report you want to mark as completed.');
            return;
        } else {
            const results = await (await connection).query(
                `SELECT * FROM reports WHERE messageId = ?;`,
                [messageId]
            );
            const OG = results[0][0].authorId;
            const author = client.users.cache.find(user => user.id === `${OG}`);
            const authorUsername = author.username;
            const original = results[0][0].description;
            const avatar = results[0][0].avatar;

            let report = new Discord.MessageEmbed()
                .setColor('#138D75')
                .setTitle(`Your bug has been fixed!`)
                .setAuthor(`${authorUsername}`, `${avatar}`)
                .setDescription(`**This is the original report:**\n${original}\n\n**This is the current status:**\n${description}\n\n`)
                .setFooter('If this is incorrect please report this!', config.bot.avatar)

            channel.messages.fetch(messageId).then(message => {
                if (message) message.delete();
            });

            (await message.client.users.cache.get(`${OG}`)).send({ embeds: [report] });

            await connection.query(
                `DELETE FROM reports WHERE messageId = ?;`,
                [messageId]
            );
            message.react('✅');
        }

    }
}