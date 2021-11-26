const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'edit-challenge',
    description: 'This gives **mods** the ability to edit the challenge questions that get asked.',
    aliases: ['editchal', 'editchallenge', 'modify-challenge', 'ec'],
    usage: 's.edit-challenge [challenge number] [updated challenge message]',
    example: 's.edit-challenge 1 What is my favorite food?',
    timeout: '6000000',
    chlMods: 1,
    mods: 1,
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
    async execute (message, args) {

            let day = args[0];
            let title = args.slice(1).join(' ');

            const result = await connection.query(
                `SELECT * FROM ChallengeQ WHERE guildId = ?;`,
                [message.guild.id]
            );
        const msgId = result[0][0].msgId;
        const result2 = await connection.query(
            `SELECT * FROM Challenge WHERE guildId = ?;`,
            [message.guild.id]
        );
            const ch = result2[0][0].channelD;
            const channel = message.guild.channels.cache.find(c => c.id === `${ch}`);

            connection.query(
                `UPDATE ChallengeQ SET title = ? WHERE msgId = ? AND guildId = ?`,
                [title, msgId, message.guild.id]
            );

            let embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTitle(`Challenge ${day}`)
                .setDescription(`${title}`)
                .setFooter('Run the s.submit to submit answers to this challenge.');
        
        channel.messages.fetch(msgId).then(message => {
            if (message) message.edit({ embeds: [embed] });
        });

            message.react('✅');



    }
}