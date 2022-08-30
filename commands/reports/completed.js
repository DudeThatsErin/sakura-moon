const connection = require('../../database.js');
const Discord = require('discord.js');
const config = require('../../config/config.json');
const bot = require('../../config/bot.json')

module.exports = {
    name: 'completedreport',
    description: 'This allows **Erin** to mark bug reports as completed and delete them from the channel.',
    aliases: ['completed-report', 'creport', 'donereport', 'done-report'],
    usage: `${config.prefix}completedreport <message ID> <description>`,
    example: `${config.prefix}completedreport 852197394828230716 The bot is broken!`,
    ownerOnly: 1,
    async execute(message, args, client) {

        let description = args.slice(1).join(' ');
        if (!description) {
            message.react('❓');
            message.reply('Please include the status Erin, sheesh.')
            return;
        }
        const channel = client.channels.cache.find(channel => channel.id === bot.reportsChId);

        const botPermissionsIn = message.guild.members.me.permissionsIn(channel);
        if(!botPermissionsIn.has(Discord.PermissionsBitField.Flags.SendMessages)) return message.author.send(`I can\'t send messages in that channel. I need to have the \`SEND MESSAGES\` permission for that channel. A mod or guild owner will need to update this. If you are seeing this in error, please run the \`${prefix}report\` command.`);

        const botPerms = [Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.ReadMessageHistory, ]
        let v = 0;
        for(const i of botPerms) {
            if(!message.guild.members.me.permissionsIn(channel).has(i)) {
                v++
            }
            if(v == botPerms.length) {
                message.react('❌');
                return message.author.send('I do not have the necessary permissions for this channel. I need \`Read Message History, View Channel, and Send Messages.\`');
            }
        }

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
            const author = client.users.cache.find(user => user.id === OG);
            const authorUsername = author.username;
            const original = results[0][0].description;
            const avatar = results[0][0].avatar;

            let report = new Discord.EmbedBuilder()
                .setColor(0x138D75)
                .setTitle(`Your bug has been fixed!`)
                .setAuthor({name: authorUsername, iconURL: avatar})
                .setDescription(`**This is the original report:**\n${original}\n\n**This is the current status:**\n${description}\n\n`)
                .setFooter({text:'If this is incorrect please report this!', iconURL: bot.avatar})

            channel.messages.fetch(messageId).then(message => {
                if (message) message.delete();
            });

            (await message.client.users.cache.get(OG)).send({ embeds: [report] });

            await connection.query(
                `DELETE FROM reports WHERE messageId = ?;`,
                [messageId]
            );
            message.react('✅');
        }

    }
}