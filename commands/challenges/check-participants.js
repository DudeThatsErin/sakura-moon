const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'check-participants',
    description: 'This allows **mods** to check who has the participants role in their server.',
    aliases: ['cp', 'contestants', 'challenge-users', 'check-users'],
    usage: 's.check-participants',
    inHelp: 'yes',
    example: 's.check-participants',
    async execute (message, args) {
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
            const result = await connection.query(
                `SELECT * FROM Challenges WHERE guildId = ?`,
                [message.guild.id]
            );
            message.channel.send('These are the members with the \`Participants\` role in the \`Challenges\` Database. If something is wrong here, please report it!');
            for (const row of result[0]){
                const Members = row.player;
                const name = await message.guild.members.cache.find(members => members.id == `${Members}`);
                const tag = name.user.tag;
                message.channel.send(`${tag}`)
            }

        }
    }
}