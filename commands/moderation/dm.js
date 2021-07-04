const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'dm',
    aliases: ['messageto', 'msgto', 'msg2', 'privatemessage', 'directmessage'],
    usage: '++dm @username or ID [message to send to memeber]',
    example: '++dm @DudeThatsErin#8061 Please stop spamming on the server. Thank you!',
    modOnly: 'yes',
    async execute(message, args, client) {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) {
            message.react('❌');
            message.channel.send('You need to ping a member or include their ID to be able to send them a DM.');
        }
        else {
            const dmmessage = args.slice(1).join(" ");
            if (dmmessage < args[0]) {
                message.react('❌');
                message.channel.send('You need to include a message to be able to send a DM to a user.');
            }
            else {

                const embed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(`Official Message from the ${message.guild.name} Moderators`)
                    .setDescription(dmmessage)
                    .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'This is not a warning, just an advisory message.', value: 'This means that we want whatever this is to stop and if it continues, we will warn you.' },
                        { name: 'If you do not understand this message, please contact:', value: message.author.tag },
                    )
                    .setTimestamp()
                    .setFooter('If you believe you received this message in error, please contact the mod team.', config.bot.avatar)
                message.react("✅");
                user.send(embed);
            }
        }
    }
}