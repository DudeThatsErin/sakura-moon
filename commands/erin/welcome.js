const config = require('../../config/config.json');
const { EmbedBuilder } = require('discord.js');
const bot = require('../../config/bot.json');

module.exports = {
    name: 'welcome',
    devOnly: 1,
    execute(message) {
        let embed = new EmbedBuilder()
            .setColor(0xFF1493)
            .setTitle('Welcome to Sakura Moon\'s Development Server!')
            .setDescription('This is where you can get help with the bot or run its random commands!')
            .setFooter({text: `If you would like to make a suggestion for the bot, use ${config.prefix}suggest!`});

        let embed2 = new EmbedBuilder()
            .setColor(0xFFB6C1)
            .setTitle('Rules')
            .setDescription('There aren\'t very many, which means you have no reason to stick to them.')
            .addFields(
                {
                    name: 'Rule 1',
                    value: 'Please keep all conversations on topic and in the correct sections.'
                },
                {
                    name: 'Rule 2',
                    value: 'Do not DM members unless you gained permission first.'
                },
                {
                    name: 'Rule 3',
                    value: 'Do not self promote in this server or via DMs.'
                },
                {
                    name: 'Rule 4',
                    value: `Do not ping Erin (the dev) unless the bot is down or there is a major error with the bot. That is why she made the \`${config.prefix}report\` command. Under no circumstances, should you DM Erin unless she told you to.`
                }
            );

        let access = new EmbedBuilder()
            .setColor(0xFFC0CB)
            .setTitle('React to this message to gain access to the server.')
            .setDescription('React with 💭 to get access to the server.');

        message.channel.send({ embeds: [embed, embed2] })
    }
}