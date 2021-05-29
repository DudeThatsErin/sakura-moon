const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'end-challenge',
    description: 'This gives **mods** the ability to end the challenge that was just being played.',
    aliases: ['endchallenge', 'echallenge', 'exitchallenge', 'exitc', 'over'],
    usage: 's.end-challenge',
    example: 's.end-challenge',
    inHelp: 'yes',
    async execute (message, args) {
        let userNames = '';
        let points = '';
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
                        
            connection.query(
                `DELETE FROM Challenge WHERE guildId = ?;`,
                [message.guild.id]
            );
            connection.query(
                `DELETE FROM Points WHERE guildId = ?;`,
                [message.guild.id]
            );
            connection.query(
                `DELETE FROM Challenges WHERE guildId = ?;`,
                [message.guild.id]
            );
            connection.query(
                `DELETE FROM Submissions WHERE guildId = ?;`,
                [message.guild.id]
            );


            const top10 = await connection.query(
                `SELECT * FROM Points WHERE guildId = ? ORDER BY points DESC LIMIT 10;`, 
                [message.guild.id]
            );    
    

            message.reply('I have deleted everything from the databases and ended the challenge for you!')

        }
    }
}