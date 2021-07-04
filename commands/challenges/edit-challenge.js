const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'edit-challenge',
    description: 'This gives **mods** the ability to edit the challenge questions that get asked.',
    aliases: ['editchal', 'editchallenge', 'modify-challenge', 'ec'],
    usage: 's.edit-challenge [message ID] [updated message]',
    inHelp: 'yes',
    example: 's.edit-challenge 851160635832139797 Updated Message Information',
    note: 'You must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    patreonOnly: 'yes',
    async execute(message, args) {


        let msgId = args[0];
        let title = args.slice(1).join(' ');

        const result = await (await connection).query(
            `SELECT * FROM Challenge WHERE guildId = ?;`,
            [message.guild.id]
        );
        const ch = result[0][0].channelD;
        const channel = message.guild.channels.cache.find(c => c.id === `${ch}`);

        const result2 = await (await connection).query(
            `SELECT challengeNo FROM Challenge WHERE msgId = ?;`,
            [msgId]
        );
        const day = result2[0][0].challengeNo;



        await (await connection).query(
            `UPDATE Challenge SET title = ? WHERE msgId = ? AND guildId = ?`,
            [title, msgId, message.guild.id]
        );

        let embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTitle(`Challenge ${day}`)
            .setDescription(`${title}`)
            .setFooter('Run the s.submit to submit answers to this challenge.');


        channel.messages.fetch(msgId).then(message => {
            if (message) message.edit(embed);
        });

        message.delete();
        message.reply('Thanks! I have updated the message you gave me the ID for.');



    }
}