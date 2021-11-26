const connection = require('../../database.js');

module.exports = {
    name: 'addguilds',
    description: 'Allows Guild/Server Owners to add their guild to the \`Guilds\` database so that moderator commands are only used by mods.',
    aliases: ['ag', 'add-guilds', 'addguild', 'add-guild', 'guildsetup', 'guild-setup', 'serversetup', 'server-setup'],
    inHelp: 'yes',
    usage: 's.addguild <moderator role ID>',
    example: 's.addguilds 849645937202036757',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_ROLES', 'MANAGE_NICKNAMES'],
    guildOwnerOnly: 1,
    async execute(message, args, client) {

        let guildId = message.guild.id;
        let guild = message.guild;
        let owner = guild.ownerId;
        let name = guild.name;
        let moderator = args[0];
        if (!moderator) return message.reply('Please provide the role ID for the moderators of your server.');


        await connection.query(
            `INSERT INTO Guilds (guildId, guildName, ownerID, modRole) VALUES(?, ?, ?, ?);`,
            [guildId, name, owner, moderator]
        );

        message.reply('You are now in the \`Guilds\` database. Thank you!');

    }
}