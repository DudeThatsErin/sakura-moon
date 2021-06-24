const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'warn',
    description: 'Allows **mods** to warn users.\nMods are considered users with the `MANAGE_MESSAGES` permission..',
    aliases: ['warning'],
    usage: 's.warn @username or ID <reason>',
    example: 's.warn @DudeThatsErin Please stop using foul language. That is not allowed in our server. Thank you!',
    inHelp: 'yes',
    permissions: 'MANAGE_MESSAGES',
    async execute(message, args) { 
        let user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if (!user) return message.channel.send('❓Please enter a valid user!');
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("❌You do not have permission for this command!");
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "**No reason given**";
        let guild = message.guild.name;
        let author = message.author.username;
        let name = user.user.username;
        let userid = user.id;

        let warning = new MessageEmbed()
            .setColor('#EC184E')
            .setTitle(`You have been warned on the ${guild} discord server`)
            .setDescription(`${author} has warned you for the following reason:\n\`\`\`${reason}\`\`\``)
            .setTimestamp()
            .setFooter('If anything appears wrong here, please report it to the dev.');
        message.client.users.cache.get(userid).send(warning);

        let embed = new MessageEmbed()
            .setColor('#F5A5B9')
            .setTitle(`I have successfully warned ${name}.`)
            .setDescription(`Thank you ${author} for warning ${user}. This is the reason we provided to the user:\n\`\`\`${reason}\`\`\``)
            .setTimestamp()
            .setFooter('If anything appears wrong here, please report it to the dev.');
        message.channel.send(embed);
    }
  };
