const connection = require('../../database.js');
const Discord = require('discord.js');

module.exports = {
    name: 'progressreport',
    description: 'You can report problems with Sakura Moon to the developers so that they can fix it.**Note:** Images or Files will *not* be accepted. Please be as detailed as possible via text.',
    aliases: ['reports', 'err', 'error', 'issue', 'issues'],
    inHelp: 'yes',
    usage: 's.progressreport <report>',
    example: 's.progressreport The bot is broken!',
    ownerOnly: 'yes',
    async execute(message, args, client) {
        let mod = message.author.id;
        let modName = message.author.username;
        let description = args.slice(1).join(' ');
        if (!args[1]) {
            message.reply('Please include the status Erin, sheesh.')
        }
        const channel = client.channels.cache.find(channel => channel.id === '852185561400999986');

        let messageId = args[0];
        if (messageId < 0) {
            message.reply('Please include the message ID for the report you want to update.')
            return;
        } else {
            const results = await (await connection).query(
                `SELECT * FROM reports WHERE messageId = ?;` [messageId]
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
                .setColor('#5241CE')
                .setTitle(`The bug report is updated!`)
                .setAuthor(`${authorUsername}`, `${avatar}`)
                .setDescription(`**This is the original report:**\n\n${original}\n\n**This is the completed status:**\n\n${description}`)
                .addFields({
                    name: 'Developer Name:',
                    value: `${modName}`
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
                .setFooter('If this is incorrect please report this!', 'https://codinghelp.site/bots/sm/neon-moon.jpg')

            channel.messages.fetch(messageId).then(message => {
                if (message) message.edit(report);
            });

            (await message.client.users.cache.get(`${OG}`)).send(report);

            message.delete();
            message.reply('I have updated the report and sent a message to the author.')

            await (await connection).query(
                `UPDATE reports SET moderator = ? AND stat = ? WHERE messageId = ?;`,
                [mod, description, messageId]
            );
        }

    }
}