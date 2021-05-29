const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'remove-user',
    description: 'This allows **mods** to manually remove users to the participants database.',
    aliases: ['remove-people', 'removeuser'],
    usage: 's.remove-user <tag user or ID>',
    example: 's.remove-user @DudeThatsErin',
    inHelp: 'yes',
    execute (message, args) {
 
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
            const mmbr = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const id = mmbr.user.id;
            const tag = mmbr.user.tag;
            if(!mmbr) {
                message.reply('You need to include a user ID or mention of the user you want to add to the database.');
            } else {
                    let embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle(`User I have removed from the database`)
                        .setDescription(`${tag}`)
                        .setFooter('If this is wrong, please report this.');
                    message.channel.send(embed);
                   connection.query(
                        `DELETE FROM Challenges WHERE guildId = ? AND player = ?;`,
                        [message.guild.id, id]
                    );
                    console.log('successfully added users in embed to the database!');
                } 
        }

    }
}