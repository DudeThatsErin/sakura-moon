const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'add-user',
    description: 'This allows **mods** to manually add users to the participants database.',
    aliases: ['add-people', 'adduser', 'manualadd', 'manual-add'],
    usage: 's.add-user [ping or ID of user you would like to add]',
    inHelp:'yes',
    example: 's.add-user 839863262026924083',
    note: 'You have to use this command for each user, one at a time.',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_ROLES', 'MANAGE_NICKNAMES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
    async execute (message, args) {
 
        const mmbr = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (mmbr == undefined) return message.reply('I am unable to add that user to the database because they have not talked in the server since the last time I was restarted. Please make sure the user sends a message in your server before you run this command. If you are receiving this message in error, please report this using the \`s.report\` command.');
        const tag = mmbr.user.tag;
        if (!mmbr) {
            message.reply('You need to include a user ID or mention of the user you want to add to the database.');
        } else {
            const isAlreadyPlaying = await connection.query(
                `SELECT player FROM chPlayers WHERE player = ? AND guildId = ?;`,
                [mmbr.id, message.guild.id]
            );
            if (isAlreadyPlaying[0][0].player === mmbr.id) {
                message.react('❌');
                message.reply('That user has already been added to the database. I am not able to add them to the database again. If believe they are not in the database, please run the \`s.check-participants\` command. If you have confirmed they are not in the database with that command, please report this error to the dev using the \`s.report\` command.');
                return;
            } else {
                let embed = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`User I have added to the database`)
                    .setDescription(`${tag}`)
                    .setFooter('Only users that have been online at least once since this bot was last rebooted will be shown here. Other users can be added using the add-participants command.');
                message.channel.send({ embeds: [embed] });
                connection.query(
                    `INSERT INTO chPlayers (guildId, player) VALUES (?, ?);`,
                    [message.guild.id, mmbr.id]
                );
            }
        }

    }
}