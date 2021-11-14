const connection = require('../../config/database.json');

module.exports = {
    name: 'clearsuggs',
    aliases: ['clearsuggestions', 'cleardb', 'cdb', 'emptydb', 'emptysuggestions', 'clear-suggs'],
    description: 'Emptys the Suggestion Database.',
    usage: '++clearsuggs',
    note: '',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    ownerOnly: 'yes',
    async execute(message, args) {

        connection.query(`TRUNCATE TABLE Suggs;`);


        message.channel.bulkDelete(99);

    }
};