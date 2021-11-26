const Discord = require('discord.js');
const connection = require('../../database.js');
const embed = require('../../config/embed.json');

module.exports = {
    name: 'manualadd-user',
    description: 'This allows **mods** to manually add users to the participants database.',
    aliases: ['manualadduser', 'manual-add-user', 'mau', 'mam', 'map', 'manualadd', 'manual-add'],
    usage: 's.add-user [ping or ID of user you would like to add]',
    inHelp: 'yes',
    timeout: '45000',
    chlMods: 1,
    mods: 1,
    example: 's.add-user 839863262026924083',
    note: 'You have to use this command for each user, one at a time.',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_ROLES', 'MANAGE_NICKNAMES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
    async execute (message, args, client) {
 
        const mmbr = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || client.users.cache.get(args[0]) || client.users.fetch(args[0]).catch(() => {});
        const tag = mmbr.user.tag;
        if (!mmbr) {
            message.reply('You need to include a user ID or mention of the user you want to add to the database.');
        } else {
            const isAlreadyPlaying = await connection.query(
                `SELECT player FROM chPlayers WHERE player = ? AND guildId = ?;`,
                [mmbr.id, message.guild.id]
            );
            if (!isAlreadyPlaying[0][0]?.player) {
                message.channel.send({ content: `I have added ${tag} to the database. 👍` });
                connection.query(
                    `INSERT INTO chPlayers (guildId, player) VALUES (?, ?);`,
                    [message.guild.id, mmbr.id]
                );
            } else {
                message.react('❌');
                message.reply('That user has already been added to the database. I am not able to add them to the database again. If believe they are not in the database, please run the \`s.check-participants\` command. If you have confirmed they are not in the database with that command, please report this error to the dev using the \`s.report\` command.');
                return;
            }
        }

    }
}