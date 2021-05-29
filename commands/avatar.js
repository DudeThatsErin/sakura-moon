module.exports = {
    name: 'av',
    description: 'Allows users to see other users avatars in a big form.',
    aliases: ['a', 'avatar', 'icon', 'pfp'],
    usage: '++av',
    example: '++av or ++avatar',
    inHelp: 'yes',
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