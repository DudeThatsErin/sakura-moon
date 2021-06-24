const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'erin',
    aliases: ['me', 'dev'],
    usage: 's.erin',
    inHelp: 'yes',
    cooldown: 0,
    example: 's.erin or s.dev',
    permissions: '',
    ownerOnly: 'yes',
    note: '',
    execute(message, args, client) {

        const embed = new Discord.MessageEmbed()
            .setColor('WHITE')
            .setTitle('Here are all of the commands you can use, Erin!')
            .setDescription('\`\`\`css\nadd-guilds\nadd-patron\nbot-status\nserver-status\nserver\nremove-guilds\nclear-suggs\ncheck-patrons\nremove-patron\nin-prog\ncompleted\ntest (test command... new stuff)\`\`\`')
            .addFields({
                name: 'This is how your config.json is set up...',
                value: `MYSQL:\n${config.mysql.host}\n${config.mysql.user}\nDB PASSWORD\n${config.mysql.database}\n\nBOT: ${config.bot.prefix}\nTOKEN\n${config.bot.tag}\n${config.bot.name}\nowner ID\`${config.bot.ownerID}\`\n${config.bot.server}\n${config.bot.invite_link}\n${config.bot.avatar}\n${config.bot.release}\n${config.bot.patreon}\n${config.bot.type}\n${config.bot.url}\nsm's server ID: \`${config.bot.server_id}\`\ntest server's ID:\`${config.bot.testserver_id}\`\n\nDEVELOPER:\n${config.developer.name}\n${config.developer.username}\n${config.developer.tag}\nmy id: \`${config.developer.id}\`\n${config.developer.url}`
            })
            .setTimestamp()
            .setFooter('Run s.help <command> to see what these do and how to use them.');

        message.channel.send(embed);
    }
}