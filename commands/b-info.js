const Discord = require('discord.js');

module.exports = {
    name: 'bot-info',
    aliases: ['binfo', 'sm', 'sakuramoon', 'sakura-moon', 'smoon', 'binformation', 'bot-information', 'botinformation'],
    description: 'Provides information about Sakura Moon to users.',
    usage: 's.bot-info',
    inHelp: 'yes',
    example: 's.bot-info or s.binfo',
    async execute(message, args) {

        let embed = new Discord.MessageEmbed()
            .setColor('BLACK')
            .setTitle('Sakura Moon')
            .setDescription('This is everything you n eed to know about Sakura Moon.')
            .addFields(
                {name: 'Invite me to your server!', value: '-invite link-'},
                {name: 'Release Date:', value: '-date-'},
                {name: 'Developer:', value: 'Erin Skidds'},
                {name: 'Want to support me?', value: '-patreon link-'}
            )
            .setTimestamp()
            .setFooter('Thanks for using Sakura Moon!');

        message.channel.send(embed);
    }
};