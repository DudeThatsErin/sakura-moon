const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Allows **mods** to ban users from their server.',
    aliases: ['goaway', 'block'],
    usage: 's.ban @username <reason>',
    example: 's.ban @DudeThatsErin spamming in the server',
    inHelp: 'yes',
    async execute(message, args, client) {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You do not have permission for this command!");
        if(!args[0]) return message.channel.send('Please enter a user!');
        let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!user) return message.channel.send('Please enter a valid user!');
        if (user.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You cannot ban this person!");
        let reason = args.join(" ").slice(1);
        if (!reason) reason = "**No reason given**";
     
        let banEmbed = new Discord.MessageEmbed()
        .setTitle(`You are permanently banned from the **${message.guild}** discord server! `)
        .setColor("#00ff00")
        .setThumbnail(client.user.displayAvatarURL)
        .addField("Banned by:", message.author)
        .addField("Reason:", reason);
        
        try {
        await user.send(banEmbed);
        } catch (error) {
            message.channel.send(`Could not send a DM message to the person!`)
        }
     
        message.guild.member(user).ban();
        message.channel.send(`${user} has been successfully banned!`);
    }
}