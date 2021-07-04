const connection = require('../../database.js');
const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'completedreport',
    description: 'This allows Erin to mark bug reports as completed and delete them from the channel.',
    aliases: ['completed-report', 'creport', 'donereport', 'done-report'],
    inHelp: 'yes',
    usage: 's.completedreport <message ID> <description>',
    example: 's.completedreport 852197394828230716 The bot is broken!',
    permissions: '',
    ownerOnly: 'yes',
    async execute(message, args, client) {

        let description = args.slice(1).join(' ');
        if (!description) {
            message.reply('Please include the status Erin, sheesh.')
            return;
        }
        const channel = client.channels.cache.find(channel => channel.id === config.bot.reportsChId);

        let messageId = args[0];
        if (messageId < 0) {
            message.reply('Please include the message ID for the report you want to update.')
            return;
        } else {
            const results = await (await connection).query(
                `SELECT * FROM reports WHERE messageId = ?;`,
                [messageId]
            );
            const guildId = results[0][0].guildId;
            const guilds = client.guilds.cache.find(guild => guild.id === `${guildId}`);
            const guildName = guilds.name;
            const OG = results[0][0].authorId;
            const author = client.users.cache.find(user => user.id === `${OG}`);
            const authorUsername = author.username;
            const original = results[0][0].description;
            const avatar = results[0][0].avatar;

            let report = new Discord.MessageEmbed()
                .setColor('#27AE60')
                .setTitle(`The bug report has been completed!`)
                .setAuthor(`${authorUsername}`, `${avatar}`)
                .setDescription(`This is the original report:\n\n${original}\n\n--------------------\n\nThis is the current status:\n\n${description}\n\n--------------------`)
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
                .setFooter('If this is incorrect please report this!', config.bot.avatar)

            channel.messages.fetch(messageId).then(message => {
                if (message) message.delete();
            });

            (await message.client.users.cache.get(`${OG}`)).send(report);

            await connection.query(
                `DELETE FROM reports WHERE messageId = ?;`,
                [messageId]
            );

            message.reply('I have deleted the report from the database and sent a message to the author telling them of the completed status.')
        }

    }
}