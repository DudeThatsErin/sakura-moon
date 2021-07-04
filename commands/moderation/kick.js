const Discord = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Allows **mods** to kick users from their server.',
    note: '',
    aliases: ['boot', 'remove', 'kk'],
    usage: 's.kick @username <reason>',
    example: 's.kick @DudeThatsErin spamming in the server',
    inHelp: 'yes',
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'KICK_MEMBERS'],
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'KICK_MEMBERS'],
    patreonOnly: 'no',
    execute(message, args) {

        let target = message.mentions.members.first();

        if (!target) {
            message.react('❌');
            message.channel.send(`**${message.author.username}**, Please mention the person who you want to kick.`);
            return;
        }

        if (!args[1]) {
            message.react('❓');
            message.channel.send(`**${message.author.username}**, Please provide a reason to kick.`);
            return;
        }

        const embed = new Discord.MessageEmbed()
            .setTitle("Action: Kick")
            .setDescription(`Kicked ${target} (${target.id})`)
            .setColor("#ff2050")
            .setFooter(`Kicked by ${message.author.username}`);

        message.channel.send(embed);

        target.kick(args[1]);
        message.react('✅');
    }
}