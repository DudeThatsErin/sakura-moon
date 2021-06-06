const Discord = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Allows **mods** to kick users from their server.',
    aliases: ['boot', 'remove', 'kk'],
    usage: 's.kick @username <reason>',
    example: 's.kick @DudeThatsErin spamming in the server',
    inHelp: 'yes',
    execute(message, args, client) {
        if(!message.member.hasPermission("KICK_MEMBERS")) {
            return message.channel.send(`**${message.author.username}**, You do not have enough permission to use this command!`)
        }
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.channel.send(`**${message.author.username}**, I do not have enough permission to use this command! Please report this to the dev if you see this message!`)
        }

        let target = message.mentions.members.first();
    
        if(!target) {
          return message.channel.send(`**${message.author.username}**, Please mention the person who you want to kick.`)
        }

        if(!args[1]) {
            return message.channel.send(`**${message.author.username}**, Please provide a reason to kick.`)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Action: Kick")
            .setDescription(`Kicked ${target} (${target.id})`)
            .setColor("#ff2050")
            .setFooter(`Kicked by ${message.author.username}`);
        
        message.channel.send(embed)
        
        target.kick(args[1]);
    }
}