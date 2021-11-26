const Discord = require('discord.js');
const connection = require('../../database.js');
const embd = require('../../config/embed.json');

module.exports = {
    name: 'remove-member',
    description: 'This allows **mods** to manually remove users to the participants database.',
    aliases: ['remove-people', 'removeuser', 'removemember', 'remove-user'],
    usage: 's.remove-user <tag user or ID>',
    example: 's.remove-user @DudeThatsErin',
    inHelp: 'yes',
    timeout: '45000',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'KICK_MEMBERS', 'MANAGE_ROLES'],
    chlMods: 1,
    mods: 1,
    async execute (message, args, client) {
 

            const mmbr = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.users.cache.get(args[0]).catch(() => {});
            const id = mmbr.user.id;
            const tag = mmbr.user.tag;
            if(!mmbr) {
                message.reply('You need to include a user ID or mention of the user you want to add to the database.');
            } else {
                    let embed = new Discord.MessageEmbed()
                        .setColor(embd.removed)
                        .setTitle(`User I have removed from the database`)
                        .setDescription(`${tag}`)
                        .setFooter('If this is wrong, please report this.');
                message.channel.send({ embeds: [embed] });
                   connection.query(
                        `DELETE FROM chPlayers WHERE guildId = ? AND player = ?;`,
                        [message.guild.id, id]
                    );
                } 

    }
}