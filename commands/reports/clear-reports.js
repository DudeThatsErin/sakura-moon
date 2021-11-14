const connection = require('../../database.js');
const bot = require('../../config/bot.json');

module.exports = {
    name: 'clear-reports',
    description: 'Allows **Erin** to clear out all of the reports in the system, she usually just uses this for testing purposes.',
    aliases: ['reports', 'err', 'error', 'issue', 'issues'],
    inHelp: 'yes',
    usage: '++clear-reports',
    ownerOnly: 'yes',
    example: '++clear-reports',
    async execute(message, args, client) {
        await connection.query(
            `TRUNCATE TABLE reports;`
        );
        const fetchedChannel = message.guild.channels.cache.get(bot.reportsChId);
        fetchedChannel.bulkDelete(99, true);

        message.react('✅');
    }
}