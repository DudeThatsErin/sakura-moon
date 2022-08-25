const Discord = require('discord.js');
const connection = require('../../database.js');
const config = require('../../config/config.json');

module.exports = {
    name: 'editsugg',
    aliases: ['edits', 'es', 'editsuggestion', 'editsuggestions', 'editsuggs', 'us', 'updatesuggestion', 'updatesugg', 'updates', 'edit-suggestions', 'edit-suggestion', 'update-suggestion', 'update-suggestions'],
    description: 'Users can update their suggestion with this command.\n**Note:** Only the original poster\'s of the suggestion can edit the message. Meaning someone posts a suggestion and only that person can edit the suggestion, no one else.',
    usage: `${config.prefix}editsugg messageID [updated message]`,
    example: `${config.prefix}editsugg 847580954306543616 I need to update my suggestion!`,
    suggest: 1,
    async execute(message, args) {

        const threadAuthor = message.member.displayName;

        const stuff = await connection.query('SELECT prefix FROM guildConfig WHERE guildId = ?;', [message.guild.id]);
        const prefix = stuff[0][0].prefix;

        const msgId = args[0];
        if(!args[0]) return message.reply('You need to include the message ID of the suggestion you would like to edit.');
        console.log(msgId)
        const result = await connection.query(
            `SELECT noSugg from Suggs WHERE noSugg = ?;`,
            [msgId]
        );
        //console.log(result[0][0]);
        if(result[0][0] === undefined) return message.reply('Is that the correct message ID? I was unable to find that in the database.');
        const mId = result[0][0].noSugg;

        const result2 = await connection.query(
            `SELECT Author from Suggs WHERE noSugg = ?;`,
            [msgId],
        );
        const author = result2[0][0].Author;

        const result3 = await connection.query(
            `SELECT Message from Suggs WHERE noSugg = ?;`,
            [msgId],
        );
        const suggestion = result3[0][0].Message;

        const result4 = await connection.query(
            `SELECT Avatar from Suggs WHERE noSugg = ?;`,
            [msgId],
        );
        const avatar = result4[0][0].Avatar;

        const stats = args.slice(1).join(' ');
        if(!stats) return message.channel.send({text:'You need to include the updated suggestion as well as the message ID.'});

        const update = 'OP Updated their own suggestion.';

        connection.query(
            `UPDATE Suggs SET Message = ?, stat = ? WHERE noSugg = ?;`,
            [stats, update, msgId],
        );

        const result8 = await connection.query(
            `SELECT Message FROM Suggs WHERE noSugg = ?;`,
            [msgId]
        );
        const upStatus = result8[0][0].Message;

        const edited = new Discord.EmbedBuilder()
            .setColor(0x1C3D77)
            .setAuthor({name: author, iconURL: avatar})
            .setDescription('Your suggestion has been updated!')
            .addFields(
                [{ name: 'Your old suggestion:', value: suggestion},
                { name: 'Your new suggestion:', value: upStatus },]
            )
            .setTimestamp()
            .setFooter({text: 'If you don\'t understand this reason, please contact the moderator that updated your suggestion. Thank you!'});
        message.author.send({ embeds: [edited] });
            message.delete()

        const editedTwo = new Discord.EmbedBuilder()
            .setColor(0x004d4d)
            .setAuthor({name: author.username, iconURL: avatar})
            .setDescription(upStatus)
            .setFooter({text:`If you are interested in submitting a suggestion please use: ${prefix}suggestion`});


            const info = await connection.query('SELECT suggsChId FROM guildConfig WHERE guildId = ?;', [message.guild.id]);
            const suggChId = info[0][0].suggsChId;

            const channel = await message.guild.channels.cache.find(c => c.id === suggChId);
            channel.messages.fetch(mId).then(message => {
                message.edit({ embeds: [editedTwo] });
                }
            )

    }

};