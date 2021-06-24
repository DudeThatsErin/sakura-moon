const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'ban',
    description: 'Allows **mods** to ban users from their server.',
    aliases: ['goaway', 'block'],
    usage: 's.ban @username <optional reason>',
    example: 's.ban @DudeThatsErin spamming in the server',
    inHelp: 'yes',
    permissions: 'BAN_MEMBERS',
    async execute(message, args, client) {
        const results = await (await connection).query(
            `SELECT * from Patrons;`
          );
        const guilds = results[0][0].guildId;
        if(message.guild.id != guilds) return message.reply('Only patrons have access to ban and unban users. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon')
        //if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("❌You do not have permission for this command!");
        if(!args[0]) return message.channel.send('❓Please enter a user!');
        let user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if (!user) return message.channel.send('❓Please enter a valid user!');
        if (user.hasPermission("MANAGE_MESSAGES")) return message.channel.send("❌You cannot ban this person! I am unable to ban anyone with the `MANAGE_MESSAGES` role.");
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
        message.channel.send(`✅ ${user} has been successfully banned! The reason they were banned was ${reason}.`);
    }
}