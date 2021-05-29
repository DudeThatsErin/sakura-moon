const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'disable-modmail',
    description: 'This gives **mods** the ability to disable to the Modmail System.',
    aliases: ['stop-modmail', 'disablemodmail', 'stopmodmail', 'dmm', 'offmodmail', 'off-modmail', 'offmm'],
    usage: 's.disable-modmail',
    example: 's.disable-modmail',
    inHelp: 'yes',
    async execute (message, args) {
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
            (await connection).query(
                `UPDATE Guilds SET modmail = ?, modlog = ? WHERE guildId = ?;`,
                ['off', 'off', message.guild.id]
            );

            message.reply('I have turned off the ModMail System. You will need to delete the category and channels.');
        }
    }
};