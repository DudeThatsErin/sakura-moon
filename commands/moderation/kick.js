const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'kick',
    description: 'Allows **mods** to kick users from their server.',
    note: 'You must be a Patreon Supporter to use this command.\n\nIf you would like to support development on Patreon, [click here](https://www.patreon.com/SakuraMoon)',
    aliases: ['boot', 'remove', 'kk'],
    usage: 's.kick @username <reason>',
    example: 's.kick @DudeThatsErin spamming in the server',
    inHelp: 'yes',
    permissions: 'KICK_MEMBERS',
    async execute(message, args, client) {

        const results = await (await connection).query(
            `SELECT * from Patrons;`
          );
        const guilds = results[0][0].guildId;
        
        if(message.guild.id != guilds) return message.reply('Only patrons have access to kick users. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');

        if(!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.channel.send(`${message.author.username}, I do not have enough permission to use this command! Please report this to the dev if you see this message!`)
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