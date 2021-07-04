const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'editsugg',
    aliases: ['edits', 'es', 'editsuggestion', 'editsuggestions', 'editsuggs', 'us', 'updatesuggestion', 'updatesugg', 'updates', 'edit-suggestions', 'edit-suggestion', 'update-suggestion', 'update-suggestions'],
    description: 'Users can update their suggestion with this command.',
    usage: 's.editsugg messageID [updated message]',
    inHelp: 'yes',
    example: 's.editsugg 847580954306543616 I need to update my suggestion!',
    permissions: '',
    patreonOnly: 'no',
    note: 'Only the original poster\'s of the suggestion can edit the message. Meaning someone posts a suggestion and only that person can edit the suggestion, no one else.',
    async execute(message, args) {
        const msgId = args[0];
        const result = await (await connection).query(
            `SELECT noSugg from Suggs WHERE noSugg = ?;`,
            [msgId]
        );
        const mId = result[0][0].noSugg;

        const result2 = await (await connection).query(
            `SELECT Author from Suggs WHERE noSugg = ?;`,
            [msgId],
        );
        const author = result2[0][0].Author;

        const result3 = await (await connection).query(
            `SELECT Message from Suggs WHERE noSugg = ?;`,
            [msgId],
        );
        const suggestion = result3[0][0].Message;

        const result4 = await (await connection).query(
            `SELECT Avatar from Suggs WHERE noSugg = ?;`,
            [msgId],
        );
        const avatar = result4[0][0].Avatar;

        const stats = args.slice(1).join(' ');
        if (!stats) return message.channel.send('You need to include the updated suggestion as well as the message ID.');

        const update = 'OP Updated their own suggestion.';

        connection.query(
            `UPDATE Suggs SET Message = ?, stat = ? WHERE noSugg = ?;`,
            [stats, update, msgId],
        );

        const result8 = await (await connection).query(
            `SELECT Message FROM Suggs WHERE noSugg = ?;`,
            [msgId]
        );
        const upStatus = result8[0][0].Message;

        const edited = new Discord.MessageEmbed()
            .setColor('1C3D77')
            .setAuthor(`${author}`, `${avatar}`)
            .setDescription('Your suggestion has been updated!')
            .addFields({
                name: 'Your old suggestion:',
                value: `${suggestion}`
            }, {
                name: 'Your new suggestion:',
                value: `${upStatus}`
            }, )
            .setTimestamp()
            .setFooter('If you do\'t understand this reason, please contact the moderator that updated your suggestion. Thank you!');
        message.author.send(edited);
        message.delete()

        const editedTwo = new Discord.MessageEmbed()
            .setColor('004d4d')
            .setAuthor(`${author}`, `${avatar}`)
            .setDescription(`${upStatus}`)
            .setFooter('If you are interested in submitting a suggestion please use: ++suggestion');

        const channel = message.guild.channels.cache.find(c => c.name === 'suggestions');
        channel.messages.fetch(mId).then(message => {
            if (message) message.edit(editedTwo);
        })

    }

};