const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Provides users with the invite link to invite the bot to their server.',
    aliases: ['inviteme', 'joinme'],
    usage: 's.invite',
    example: 's.invite',
    inHelp: 'yes',
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
    execute(message, args) {

        let invite = new MessageEmbed()
            .setColor('#B9E5E5')
            .setTitle('Add me to your server!')
            .setDescription('You can [use this link](https://discord.com/api/oauth2/authorize?client_id=791803587432677427&permissions=8&scope=applications.commands%20bot) to invite me to your server!\n\n**Note:** I need to be an administrator for all of my functions to work.')
            .setTimestamp()
            .setFooter('Thanks for your interest!');

        message.channel.send(invite);
    }
};