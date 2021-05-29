const connection = require('../../database.js');

module.exports = {
    name: 'clearsuggs',
    aliases: ['clearsuggestions', 'cleardb', 'cdb', 'emptydb', 'emptysuggestions', 'clear-suggs'],
    description: 'Emptys the Suggestion Database. \n **Note:** Only DudeThatsErin#8061 can run this command.',
    usage: 's.clearsuggs',
    async execute(message, args) {

        connection.query(`TRUNCATE TABLE Suggs;`);

        if(message.author.id == "455926927371534346") {
            message.channel.bulkDelete(99);
        } else {
            message.channel.send('You do not have the permissions to use this command. Erin is the only user that can run this command.')
        }

    }
};