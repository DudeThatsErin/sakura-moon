const Discord = require('discord.js');
const ee = require('../../config/embed.json');
const config = require('../../config/config.json');

module.exports = {
    name: 'server-status',
    aliases: ['status-update', 'statusupdate', 'serverstatus'],
    description: 'Pushes an embed to display in the channel about a certain update.',
    usage: `${config.prefix}server-status Status Message`,
    ownerOnly: 1,
    async execute(message, args, client) {
        const channel = client.channels.cache.find(channel => channel.id === config.announcementsId);
        const reason = args.slice(0).join(" ");
        if (!reason) return message.reply({content:'You forgot to include a status message. SMH'});


        let embed = new Discord.EmbedBuilder()
            .setColor(ee.blue)
            .setTitle('Hello, The Moderators have a new update for you!')
            .setDescription(reason)
            .setTimestamp()
            .setFooter({text: `Want to suggest a feature for the server? Use ${config.prefix}suggest`});
        message.react('👍');
        channel.send({ content: `Hey, Test,`, embeds: [embed] }) // Bot Updates #HERE or Server Updates #HERE

    }
};