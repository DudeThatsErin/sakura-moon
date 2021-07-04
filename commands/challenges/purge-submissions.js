const connection = require('../../database.js');

module.exports = {
    name: 'purge-submissions',
    description: 'This gives **mods** the ability to purge all submissions from the submissions database.',
    aliases: ['purges', 'psubmissions', 'psubs', 'purgesubs', 'deletesubs', 'delete-subs'],
    usage: 's.purge-submissions',
    example: 's.purge-submissions',
    inHelp: 'yes',
    note: 'You must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    patreonOnly: 'yes',
    async execute(message, args) {

        await (await connection).query(
            `DELETE FROM Submissions WHERE guildId = ?;`,
            [message.guild.id]
        );
        message.react('✅');
        message.reply('I have deleted all of the submissions from the submissions database. If you would like to remove them from the Discord Channel, you can run \`s.purge [number 2-100]\` in that channel.');


    }
}