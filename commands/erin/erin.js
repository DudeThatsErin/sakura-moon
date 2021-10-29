const Discord = require('discord.js');
const config = require('../../config/config.json');
const ee = require('../../config/embed.json');
const db = require('../../config/database.json');
const bot = require('../../config/bot.json');
const me = require('../../config/owner.json');

module.exports = {
    name: 'erin',
    aliases: ['me', 'dev'],
    description: 'Shows erin how the config.json files are set up.',
    usage: 's.erin',
    inHelp: 'yes',
    cooldown: 0,
    example: '++erin or ++dev',
    userPerms: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    ownerOnly: 'yes',
    note: '',
    execute(message, args, client) {

        const embed = new Discord.MessageEmbed()
            .setColor(ee.rand_color)
            .setTitle('Here are all of the commands you can use, Erin!')
            .setDescription('\`\`\`css\nclearsuggs\nerin\nfileUpload\nserver\nstatus\ntoadd\ntofix\nquicknotes\nclearadd\nclearfix\nclearnotes\n\`\`\`\n\nThis is how your config.json is set up...')
            .addFields(
                {
                    name: 'MYSQL',
                    value: `${db.host}\n${db.user}\nDB PASSWORD\n${db.database}`,
                    inline: true
                },
                {
                    name: 'CONFIG JSON',
                    value: `PREFIX\n\`${config.prefix}\` or \`/\`\nTOKEN`,
                    inline: true
                },
                {
                    name: 'DEVELOPER:',
                    value: `${me.name}\n${me.username}\n${me.tag}\nmy id: \n\`${me.id}\`\n${me.url}`,
                    inline: true
                },
                {
                    name: 'BOT JSON:',
                    value: `${bot.tag}\n${bot.name}\nserver link: \n${bot.server}\navatar link: \n${bot.avatar}\ngithub link: \n${bot.github}\nurl: \n${bot.url}\nch's server ID:\n\`${bot.serverId}\`\ntest server's ID: \n\`${bot.testServerId}\`\nreports ch ID:\n\`${bot.reportsChId}\`\nchannel guide ch ID:\n\`${bot.channelGuideId}\`\nannouncements ch ID:\n\`${bot.announcementsId}\`\nsuggestions ch ID:\n\`${bot.suggestionsId}\`\nchallenges ch ID:\n\`${bot.challengesId}\`\nchallenge leaderboard ch ID:\n\`${bot.chLeaderboardId}\`\nslash commands ID:\n\`${bot.commandsId}\``,
                    inline: true
                }
                )
            .setTimestamp()
            .setFooter('Run /help <command> to see what these do and how to use them.');
        message.delete(5);
        message.channel.send({ embeds: [embed] });
    }
}