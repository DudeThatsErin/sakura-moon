const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: 'messageto',
    aliases: ['dm', 'message', 'pm'],
    note: '',
    userPerms: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    botPerms: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    usage: 's.messageto <@member or member ID> <message>',
    example: 's.messageto @DudeThatsErin#8061 Why are you being stupid?',
    inHelp: 'yes',
    async execute(message, args, client) {
        // define variables
        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        const dmmessage = args.slice(1).join(" ");
        const placeName = message.guild.name;
        const author = message.author.tag;
        const icon = message.guild.iconURL({
            dynamic: true
        });

        // do something with those variables
        if (!user) return message.channel.send('User not found.');
        if (!dmmessage) {
            message.react("❌");
            message.channel.send('You need to include a message to send to the user. I\'m not going to send a blank message;')
            return;
        }

        // define embed
        const embed = new MessageEmbed()
            .setColor('WHITE')
            .setTitle(`Official Message from ${placeName}`)
            .setDescription(`${dmmessage}`)
            .addFields({
                name: 'If you have questions, please contact the author of this message...',
                value: author,
                inline: false
            })
            .setThumbnail(`${icon}`)
            .setFooter('If this is received in error, please report this with the s.report command!', `${icon}`);

        // ultimate send
        message.react("✅");
        user.send(embed);
    }
}