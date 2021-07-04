const Discord = require('discord.js');

module.exports = {
    name: 'bot-info',
    aliases: ['binfo', 'sm', 'sakuramoon', 'sakura-moon', 'smoon', 'binformation', 'bot-information', 'botinformation', 'botinfo'],
    description: 'Provides information about Sakura Moon to users.',
    usage: 's.bot-info',
    inHelp: 'yes',
    example: 's.bot-info or s.binfo',
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
    async execute(message, args) {

        let embed = new Discord.MessageEmbed()
            .setColor('#EB74EE')
            .setTitle('Sakura Moon')
            .setImage('https://codinghelp.site/bots/sm/neon-moon.jpg')
            .setDescription('This is everything you need to know about Sakura Moon.')
            .addFields({
                name: 'Invite someone to my server!',
                value: 'https://discord.gg/tT3VEW8AYF'
            }, {
                name: 'Invite me to your server!',
                value: 'https://discord.com/api/oauth2/authorize?client_id=791803587432677427&permissions=8&scope=bot'
            }, {
                name: 'Release Date:',
                value: '6 June 2021'
            }, {
                name: 'Bot Type/Category',
                value: 'Utility/Miscellaneous'
            }, {
                name: 'Developer:',
                value: 'Erin Skidds'
            }, {
                name: 'Want to support me?',
                value: 'https://www.patreon.com/SakuraMoon'
            })
            .setTimestamp()
            .setFooter('Thanks for using Sakura Moon!', 'https://codinghelp.site/bots/sm/neon-moon.jpg');

        message.channel.send(embed);
    }
};