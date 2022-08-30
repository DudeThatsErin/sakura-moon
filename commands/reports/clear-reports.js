const connection = require('../../database.js');
const bot = require('../../config/bot.json');

module.exports = {
    name: 'clear-reports',
    description: 'Allows **Erin** to clear out all of the reports in the system, she usually just uses this for testing purposes.',
    aliases: ['err', 'error', 'issue', 'issues', 'clearreports'],
    usage: 'sm!clear-reports',
    devOnly: 1,
    example: 'sm!clear-reports',
    async execute(message) {
        await connection.query(
            `TRUNCATE TABLE reports;`
        );
        const fetchedChannel = message.guild.channels.cache.get(bot.reportsChId);

        const botPermissionsIn = message.guild.members.me.permissionsIn(fetchedChannel);
        if(!botPermissionsIn.has(Discord.PermissionsBitField.Flags.SendMessages)) return message.author.send(`I can\'t send messages in that channel. I need to have the \`SEND MESSAGES\` permission for that channel. A mod or guild owner will need to update this. If you are seeing this in error, please run the \`${prefix}report\` command.`);

        const botPerms = [Discord.PermissionsBitField.Flags.ManageMessages, Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.ReadMessageHistory, ]
        let v = 0;
        for(const i of botPerms) {
            if(!message.guild.members.me.permissionsIn(fetchedChannel).has(i)) {
                v++
            }
            if(v == botPerms.length) {
                message.react('❌');
                return message.author.send('I do not have the necessary permissions for this channel. I need \`Manage Messages, Read Message History, View Channel, and Send Messages.\`');
            }
        }
        fetchedChannel.bulkDelete(99);

        message.react('✅');
    }
}