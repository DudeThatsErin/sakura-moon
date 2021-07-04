module.exports = {
    name: 'av',
    description: 'Allows users to see other users avatars in a big form.',
    aliases: ['a', 'avatar', 'icon', 'pfp'],
    usage: 's.av',
    example: 's.av or s.avatar',
    inHelp: 'yes',
    note: 'You are able to mention multiple users at a time to get multiple avatars at one time.',
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
        }

        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL({ format: 'png', dynamic: true })}>`;
        });

        // Send the entire array of strings as a message
        // By default, discord.js will `.join()` the array with `\n`
        message.channel.send(avatarList);

    }

};