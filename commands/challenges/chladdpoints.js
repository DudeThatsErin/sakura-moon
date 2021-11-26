const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'add-points',
    description: 'This allows **mods** to automatically add points to a participant\'s challenge to the Challenges database.',
    aliases: ['chladdpnts', 'chlpointsadd', 'chl-add-points', 'chl-points-add', 'chl-add-pnts'],
    usage: 's.add-points <message ID> <number of points>',
    inHelp: 'yes',
    example: 's.add-points 850726247050903562 3',
    timeout: '45000',
    chlMods: 1,
    mods: 1,
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_ROLES', 'MANAGE_NICKNAMES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
    async execute (message, args, client) {
        let msgId = args[0];
        if (!msgId) return message.reply('You need to include the message ID for the submission you want to add points to. You can add points to submissions that were already reviewed.');
            let author = message.author.username;
            let name = message.author.id;
        let points = args[1];
        if (!points) return message.reply('You need to tell me how many points to give to the user. Without that I can\'t do anything.');
            const results = await connection.query(
                `SELECT * FROM Submissions WHERE msgId = ?;`,
                [msgId]
        );
        if (results[0][0]?.author === undefined) return message.reply('Please make sure you are providing the correct message ID. That message ID is not found in the database. You can use the command \`s.mod-check-submissions\` to grab the message ID from the database.');
            let player = results[0][0]?.author;
            let playerID = client.users.cache.get(player) || await client.users.fetch(player).catch(err => {console.log(err);});
            let playerName = playerID.username;

        if (!msgId) {
                message.react('❌')
                message.channel.send('You need to include the submission\'s message ID of the submission you want to add points to.');
                return;
            } else {
                    
                    let embed = new Discord.MessageEmbed()
                        .setColor('#c9a066')
                        .setTitle(`I have added ${points} points to ${playerName}!`)
                        .setDescription(`Thank you for that, ${author}!`)
                        .setTimestamp()
                        .setFooter('If there is a problem with this, please report it!');
                    
                    connection.query(
                        `UPDATE Submissions SET moderator = ?, points = points + ? WHERE msgId = ?;`,
                        [name, points, msgId]
                    );
                message.channel.send({ embeds: [embed] });

            }  

    }
}