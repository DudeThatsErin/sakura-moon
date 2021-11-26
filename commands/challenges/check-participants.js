const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'check-participants',
    description: 'This allows **mods** to check who has the participants role in their server. They can either print out EVERYONE in the \`Challenges\` database or they can check people one by one.',
    aliases: ['cp', 'contestants', 'challenge-users', 'check-users', 'checkplayers', 'check-players', 'players', 'checkusers', 'challengeusers'],
    usage: 's.check-participants OR s.check-participants [ping or user\'s ID]',
    example: 's.check-participants OR s.check-participants 822160626226036736',
    timeout: '30000',
    chlMods: 1,
    mods: 1,
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_ROLES', 'MANAGE_NICKNAMES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
    async execute(message, args, client) {

        if (!args || args < 1) {
            const result = await connection.query(
                `SELECT * FROM chPlayers WHERE guildId = ?`,
                [message.guild.id]
            );
        
            message.channel.send({ content: 'These are the members with the \`Participants\` role in the \`Challenges\` Database. If something is wrong here, please report it to the dev! Use \`s.report\` to report it, please be as detailed as possible. Thank you!' });
        
            for (const row of result[0]) {
                const Members = row.player;
                const name = client.users.cache.get(Members) || await client.users.fetch(Members).catch(() => { });
                const username = name.username;
                message.channel.send({ content: `${username}` })
            }
        }
        else if (args[0]) {

            const mmbr = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => {});
            const tag = mmbr.user.tag;

            const result = await connection.query(
                `SELECT player FROM chPlayers WHERE guildId = ? AND player = ?;`,
                [message.guild.id, mmbr.id]
            );
            if (result[0][0]?.player === mmbr.id) {
                message.channel.send(`${tag} is currently in the \`Challenges\` database. You do not need to add them again.`)
                return;
            } else {
                message.channel.send(`${tag} is **not** currently in the \`Challenges\` database. You need to add them with the \`s.manualadd ${mmbr.id}\` command. If you are receiving an error from that command stating they are in the database, please report this to the dev with the \`s.report\` command! Thank you.`);
                return;
            }

        }
                
    }
}