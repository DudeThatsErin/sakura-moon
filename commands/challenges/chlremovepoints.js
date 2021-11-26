const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'remove-points',
    description: 'This allows **mods** to automatically remove points from a participant\'s challenge in the Challenges database.',
    aliases: ['chlremovepnts', 'chlpointsremove', 'chlpointsdelete', 'chl-remove-points', 'chl-points-remove', 'chl-points-delete', 'chl-points-rem', 'chlpointsrem'],
    usage: 's.remove-points <message ID> <number of points>',
    inHelp: 'yes',
    example: 's.remove-points 850726247050903562 3',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    async execute (message, args, client) {

        let msgId = args[0];
        if (!msgId) return message.reply('You need to include the message ID for the message you want to remove points from.');
            let author = message.author.username;
            let name = message.author.id;
        let points = args[1];
        if (!points) return message.reply('You need to tell me how many points to remove from the message.');
        const results = await connection.query(
            `SELECT * FROM Submissions WHERE msgId = ?;`,
            [msgId]
        );
        if (results[0][0]?.moderator === undefined) return message.reply('This message has not been reviewed yet. I can only remove points from reviewed submissions.');
            let player = results[0][0].author;
            let playerID = client.users.cache.get(player) || await message.client.users.fetch(player).catch(err => {console.log(err);});
            let playerName = playerID.username;
                    
                    let embed = new Discord.MessageEmbed()
                        .setColor('#c9a066')
                        .setTitle(`I have removed ${points} points from ${playerName}!`)
                        .setDescription(`Thank you for that, ${author}!`)
                        .setFooter('If there is a problem with this, please report it!');
                    
                    connection.query(
                        `UPDATE Submissions SET moderator = ?, points = points - ? WHERE msgId = ?;`,
                        [name, points, msgId]
                    );
            message.channel.send({ embeds: [embed] });


    }
}