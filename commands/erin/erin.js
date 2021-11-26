const Discord = require('discord.js');
const config = require('../../config/config.json');
const ee = require('../../config/embed.json');
module.exports = {
    name: 'erin',
    aliases: ['me', 'dev'],
    description: 'Shows erin how the config.json is set up.',
    usage: 's.erin',
    inHelp: 'yes',
    cooldown: 0,
    example: '++erin or ++dev',
    botPerms: [''],
    userPerms: [''],
    ownerOnly: 'yes',
    note: '',
    execute(message, args, client) {

        const embed = new Discord.MessageEmbed()
            .setColor(ee.rand_color)
            .setTitle('Here are all of the commands you can use, Erin!')
            .setDescription('\`\`\`css\nadd-guilds\nadd-patron\nbot-status\nserver-status\nserver\nremove-guilds\nclear-suggs\ncheck-patrons\nremove-patron\nin-prog\ncompleted\ntest (test command... new stuff)\`\`\`')
            .addFields({
                name: 'This is how your config.json is set up...',
                value: `MYSQL:\n${config.mysql.host}\n${config.mysql.user}\nDB PASSWORD\n${config.mysql.database}\n\nBOT: ${config.bot.prefix}\nTOKEN\n${config.bot.tag}\n${config.bot.name}\nowner ID\`${config.bot.ownerID}\`\n${config.bot.server}\n${config.bot.invite_link}\n${config.bot.avatar}\n${config.bot.release}\n${config.bot.patreon}\n${config.bot.type}\n${config.bot.url}\nsm's server ID: \`${config.bot.server_id}\`\ntest server's ID:\`${config.bot.testserver_id}\`\n\nDEVELOPER:\n${config.developer.name}\n${config.developer.username}\n${config.developer.tag}\nmy id: \`${config.developer.id}\`\n${config.developer.url}`
            })
            .setTimestamp()
            .setFooter('Run ++help <command> to see what these do and how to use them.');

        message.channel.send({ embeds: [embed] });
    }
}