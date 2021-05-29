const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'edit-challenge',
    description: 'This gives **mods** the ability to edit the challenge questions that get asked.',
    aliases: ['editchal', 'editchallenge', 'modify-challenge', 'ec'],
    usage: 's.edit-challenge [challenge number] <number of points> [message ID]',
    inHelp: 'yes',
    example: 's.edit-challenge 1 3 847580954306543616',
    async execute (message, args) {

        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
            let day = args[0];
            let title = args.slice(1).join(' ');

            const result = await connection.query(
                `SELECT * FROM Challenge WHERE guildId = ?;`,
                [message.guild.id]
            );
            const msgId = result[0][0].msgId;
            const ch = result[0][0].channelD;
            const channel = message.guild.channels.cache.find(c => c.id === `${ch}`);


            channel.messages.fetch(msgId).then(message => {
                if(message) message.edit(embed);
            });

            connection.query(
                `UPDATE Challenge SET title = ? WHERE msgId = ? AND guildId = ?`,
                [title, msgId, message.guild.id]
            );

            let embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTitle(`Challenge ${day}`)
                .setDescription(`${title}`)
                .setFooter('Run the ++submit to submit answers to this challenge.');

            message.delete();
            message.reply('Thanks! I have updated the message you gave me the ID for.');

        }


    }
}