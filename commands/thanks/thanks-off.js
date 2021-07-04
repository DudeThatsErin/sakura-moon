const connection = require('../../database.js');

module.exports = {
    name: 'thanks-off',
    description: 'Allows **mods** to turn off the Thanks System. You must run \`s.thanks-on\` first for this command to work.',
    aliases: ['tks-off', 'thx-off', 'toff', 'thanksoff', 'txoff', 'txoff', 'thnxoff', 'thxoff'],
    usage: 's.thanks-off',
    example: 's.thanks-off or s.thxoff or s.txoff',
    inHelp: 'yes',
    cooldown: 0,
    note: 'You do not need to specify the channels, this just turns them all off and removes those channel IDs you specified in \`s.thanks-on\` from the database.\nYou must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    patreonOnly: 'no',
    async execute(message) {

        await (await connection).query(
            `UPDATE Guilds SET thanks = ?, txChannels = ? WHERE guildId = ?`,
            [0, 0, message.guild.id]
        );
        await (await connection).query(
            `DELETE FROM Thanks WHERE guildId = ?;`,
            [message.guild.id]
        )

        message.react('✅');
        message.channel.send('I have turned off the Thanks System for you. \`s.thanks\` and \`s.thanks-leaderboard\` commands will no longer work.');
    }
}