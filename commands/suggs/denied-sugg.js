const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'denied-sugg',
    aliases: ['deniedsugg', 'denys', 'nosugg', 'deniedsuggestion', 'deniedsuggestions', 'denysugg'],
    inHelp: 'yes',
    description: 'Allows **mods** to deny a particular suggestion.',
    usage: 's.deniedsugg messageID [reason]',
    example: 's.deniedsugg 847580954306543616 I don\'t want to do what you suggested! GO AWAY!',
    note: 'You must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    patreonOnly: 'no',
    async execute(message, args) {

        const msgId = args[0];
        if (msgId > 0) {
            try {
                const result = await (await connection).query(
                    `SELECT noSugg from Suggs WHERE noSugg = ?;`,
                    [msgId]
                );
                const mId = result[0][0].noSugg;
            } catch (error) {
                message.reply('There was an error grabbing the ID from the database. Please report this!');
                console.log(error);
            }

            const result2 = await (await connection).query(
                `SELECT Author from Suggs WHERE noSugg = ?;`,
                [msgId],
            );
            const OGauthor = result2[0][0].Author;
            const aut = OGauthor.tag;

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

            const mod = message.author.id;

            const stats = args.slice(1).join(' ');
            if (!stats) return message.channel.send('You need to include the status of the suggestion as well as the message ID.');

            connection.query(
                `UPDATE Suggs SET stat = ?, Moderator = ? WHERE noSugg = ?;`,
                [stats, mod, msgId],
            );

            const result8 = await (await connection).query(
                `SELECT stat FROM Suggs WHERE noSugg = ?;`,
                [msgId]
            );
            const upStatus = result8[0][0].stat;

            const moderator = await (await connection).query(
                `SELECT Moderator FROM Suggs WHERE noSugg = ?;`,
                [msgId]
            );
            const moder = moderator[0][0].Moderator;
            const moderate = moder.tag || message.author.tag;

            const denied = new Discord.MessageEmbed()
                .setColor('A4503E')
                .setAuthor(`${aut}`, `${avatar}`)
                .setDescription(`${suggestion}`)
                .addFields({
                    name: 'Unfortunately, your suggestion was denied. This is the reason:',
                    value: `${upStatus}`
                }, {
                    name: 'Moderator that denied your suggestion:',
                    value: `${moderate}`
                }, )
                .setTimestamp()
                .setFooter('If you don\'t understand this reason, please contact the moderator that updated your suggestion. Thank you!');
            message.client.users.cache.get(`${OGauthor}`).send(denied);
            message.channel.send(`I have denied the suggestion you told me to, <@${moder}>. I also sent a message to <@${OGauthor}> about this denial and the reason as well as deleted the message in the Suggestions channel.`)
            message.delete();
            try {
                await (await connection).query(
                    `DELETE FROM Suggs WHERE noSugg = ? AND Author = ?;`,
                    [msgId, OGauthor],
                );
            } catch (error) {
                message.reply('There was an error deleting the suggestion from the database. Please report this!');
                console.log(error);
            }
            const chnnel = await message.guild.channels.cache.find(c => c.name === 'suggestions');
            chnnel.messages.fetch(msgId).then(message => {
                message.delete();
            })
        }
    }
};