const Discord = require('discord.js')
const connection = require('../../database.js');

module.exports = {
    name: 'completedsugg',
    aliases: ['cs', 'dones', 'donesugg', 'completedsuggestion', 'completedsuggestions', 'acceptedsugg', 'acceptedsuggestions', 'acceptedsuggestion', 'oksugg', 'oks'],
    inHelp: 'yes',
    description: 'Marks a specific suggestion as completed. **Note:** This can only be ran by moderators.',
    usage: 's.completedsugg messageID [reason]',
    example: 's.completedsugg 847580954306543616 I have completed your suggestion!',
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
            const aut = (await message.client.users.cache.get(`${OGauthor}`)).tag;

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


            mod = message.author.id;

            const stats = args.slice(1).join(' ');
            if (!stats) return message.channel.send('You need to include the completion status message for this suggestion as well as the message ID.');

            try {
                await (await connection).query(
                    `UPDATE Suggs SET stat = ?, Moderator = ? WHERE noSugg = ?;`,
                    [stats, mod, msgId],
                );
            } catch (error) {
                message.react('❌');
                message.reply('There was an error updating the suggestion in the database. Please report this!');
                console.log(error);
            }


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
                .setColor('#41BFCE')
                .setAuthor(`${aut}`, `${avatar}`)
                .setDescription(`Your suggestion was completed! This was the decision:\`\`\`${upStatus}\`\`\``)
                .addFields({
                    name: 'Original Suggestion:',
                    value: `\`\`\`${suggestion}\`\`\``
                }, {
                    name: 'Moderator that completed your suggestion:',
                    value: `${moderate}`
                }, )
                .setTimestamp()
                .setFooter('If you don\'t understand this decision, please contact the moderator that completed your suggestion. Thank you!');


            (await message.client.users.cache.get(`${OGauthor}`)).send(denied);
            message.delete();
            message.channel.send(denied);

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
            });
        } else {
            message.react('❌');
            message.reply('You need to include the ID of the message you want to mark as completed.')
        }
    }
};