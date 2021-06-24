const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'add-points',
    description: 'This allows **mods** to automatically add points to a participant\'s challenge to the Challenges database.',
    aliases: ['addpnts', 'pluspnts', 'addpoints', 'apnts', 'pluspoints'],
    usage: 's.add-points <message ID> <number of points>',
    inHelp: 'yes',
    example: 's.add-points 850726247050903562 3',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    note: 'In order for mods to use this command, someone from the Guild needs to support Sakura Moon on [Patreon](https://www.patreon.com/SakuraMoon) and they need to have one of the following permissions:\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`.',
    async execute (message, args) {

      const results = await connection.query(
        `SELECT * from Patrons WHERE guildId = ?;`,
        [message.guild.id]
    );
      if(results[0][0] === undefined || results[0][0] === 'undefined') return message.reply('Only patrons have access to use the Challenge System. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');        let role = message.member.roles.cache.has('839863262026924083') || !message.member.roles.cache.has('718253309101867008');
        if(!role){ 
            message.channel.send('You do not have permission to run this command. Only moderators can run this command!');
            return;
        } else {
            let msgId = args[0];
            let author = message.author.username;
            let name = message.author.id;
            let points = args[1];
            const results = await (await connection).query(
                `SELECT * FROM Submissions WHERE msgId = ?;`,
                [msgId]
            );
            let player = results[0][0].author;
            let playerID = await message.client.users.fetch(player).catch(err => {console.log(err);});
            let playerName = playerID.username;

            if(!msgId){ 
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
                    message.channel.send(embed);          

            }
        }    

    }
}
