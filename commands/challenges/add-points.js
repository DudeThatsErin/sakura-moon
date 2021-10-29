const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'add-points',
    description: 'This allows **mods** to automatically add points to a participant\'s challenge to the Challenges database.',
    aliases: ['addpnts', 'pluspnts', 'addpoints', 'apnts', 'pluspoints'],
    usage: '++add-points <message ID> <number of points>',
    inHelp: 'yes',
    example: '++add-points 850726247050903562 3',
    challengeMods: 'yes',
    modOnly: 'yes',
    userPerms: [''],
    botPerms: [''],
    async execute (message, args) {
            let msgId = args[0];
            let author = message.author.username;
            let name = message.author.id;
            let points = args[1];
            const results = await connection.query(
                `SELECT * FROM Submissions WHERE msgId = ?;`,
                [msgId]
            );
            let player = results[0][0].author;
            let playerID = await message.client.users.fetch(player).catch(err => {console.log(err);});
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
                        .setFooter('If there is a problem with this, please report it!');
                    
                    connection.query(
                        `UPDATE Submissions SET moderator = ?, points = points + ? WHERE msgId = ?;`,
                        [name, points, msgId]
                    );
                message.channel.send({ embeds: [embed] });

            }  

    }
}