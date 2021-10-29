const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'edit-challenge',
    description: 'This gives **mods** the ability to edit the challenge questions that get asked.',
    aliases: ['editchal', 'editchallenge', 'modify-challenge', 'ec'],
    usage: '++edit-challenge [challenge number] <number of points> [message ID]',
    challengeMods: 'yes',
    modOnly: 'yes',
    userPerms: [''],
    botPerms: [''],
    async execute (message, args) {

            let day = args[0];
            let title = args.slice(1).join(' ');

            const result = await connection.query(
                `SELECT * FROM Challenge WHERE guildId = ?;`,
                [message.guild.id]
            );
            const msgId = result[0][0].msgId;
            const ch = result[0][0].channelD;
            const channel = message.guild.channels.cache.find(c => c.id === `${ch}`);

            connection.query(
                `UPDATE Challenge SET title = ? WHERE msgId = ? AND guildId = ?`,
                [title, msgId, message.guild.id]
            );

            let embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTitle(`Challenge ${day}`)
                .setDescription(`${title}`)
                .setFooter('Run the ++submit to submit answers to this challenge.');
        
        channel.messages.fetch(msgId).then(message => {
            if (message) message.edit({ embeds: [embed] });
        });

            message.react('✅');



    }
}