const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Allows **mods** to ban users from their server.',
    aliases: ['goaway', 'block'],
    usage: 's.ban @username <optional reason>',
    example: 's.ban @DudeThatsErin spamming in the server',
    inHelp: 'yes',
    note: 'You & I must have the \`BAN_MEMBERS\` permission to run this command. I also cannot ban members that have their role above mine on the list of roles.',
    patreonOnly: 'no',
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'BAN_MEMBERS'],
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'BAN_MEMBERS'],
    async execute(message, args, client) {

        //if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("❌You do not have permission for this command!");
        if (!args[0]) return message.channel.send('❓Please enter a user!');
        let user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if (!user) {
            message.react('❓');
            message.channel.send('Please enter a valid user!');
            return;
        }
        if (user.hasPermission("MANAGE_MESSAGES")) {
            message.react('❌');
            message.channel.send("You cannot ban this person! I am unable to ban anyone with the `MANAGE_MESSAGES` role.");
            return;
        }
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
            message.react('❌')
            message.channel.send(`Could not send a DM message to the person!`)
        }

        message.guild.member(user).ban();
        message.react('✅')
        message.channel.send(`${user} has been successfully banned! The reason they were banned was ${reason}.`);
    }
}