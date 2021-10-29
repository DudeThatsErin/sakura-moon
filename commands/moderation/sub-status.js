const Discord = require('discord.js');
const bot = require('../../config/bot.json');
const ee = require('../../config/embed.json');

module.exports = {
    name: 'sub-status',
    aliases: ['sub-update', 'substatus', 'subupdate'],
    description: 'Pushes an embed to display in the channel about a certain update.',
    usage: '++sub-status Status Message',
    modOnly: 'yes',
    userPerms: ['MANAGE_MESSAGES'],
    ownerOnly: 'no',
    async execute(message, args, client) {

        const reason = args.slice(0).join(" ");
        if (!reason) return message.reply('You forgot to include a status message. SMH');

        const channel = client.channels.cache.find(channel => channel.id === bot.announcementsId); //
        let embed = new Discord.MessageEmbed()
            .setColor(ee.sub_status)
            .setTitle('Hello, The Moderators have a new update for you!')
            .setDescription(`${reason}`)
            .setTimestamp()
            .setFooter('Want to suggest a feature for the website? Use ++suggest');
        message.react('👍');
        channel.send({ content: `Hello <@&780111997861363742>,`, embeds: [embed] })


    }
};