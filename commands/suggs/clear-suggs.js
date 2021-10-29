const connection = require('../../database.js');

module.exports = {
    name: 'clearsuggs',
    aliases: ['clearsuggestions', 'cleardb', 'cdb', 'emptydb', 'emptysuggestions', 'clear-suggs'],
    description: 'Emptys the Suggestion Database. \n **Note:** Only DudeThatsErin#8061 can run this command.',
    usage: '++clearsuggs',
    ownerOnly: 'yes',
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['ADMINISTRATOR'],
    async execute(message, args) {

        connection.query(`TRUNCATE TABLE Suggs;`);


            message.channel.bulkDelete(99);

    }
};