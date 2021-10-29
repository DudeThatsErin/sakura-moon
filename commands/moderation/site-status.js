const Discord = require('discord.js');
const bot = require('../../config/bot.json');
const ee = require('../../config/embed.json');

module.exports = {
    name: 'site-status',
    aliases: ['site-update', 'sitestatus', 'siteupdate'],
    description: 'Pushes an embed to display in the channel about a certain update.',
    usage: '++site-status Status Message',
    modOnly: 'yes',
    userPerms: ['MANAGE_MESSAGES'],
    ownerOnly: 'yes',
    async execute(message, args, client) {

        const reason = args.slice(0).join(" ");
        if (!reason) return message.reply('You forgot to include a status message. SMH');

        const channel = client.channels.cache.find(channel => channel.id === bot.announcementsId);
        let embed = new Discord.MessageEmbed()
            .setColor(ee.sub_status)
            .setTitle('Hello, The Moderators have a new update for you!')
            .setDescription(`${reason}`)
            .setTimestamp()
            .setFooter('Want to suggest a feature for the website? Use ++suggest');
        message.react('👍');
        channel.send({ content: `Hey, <@&772153399336632330>,`, embeds: [embed] }) // Subreddit Updates 780111997861363742 or Bot Updates 772154227459883019 or Server Updates 772153457111990282

    }
};