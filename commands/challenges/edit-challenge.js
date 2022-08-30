const Discord = require('discord.js');
const connection = require('../../database.js');
const config = require('../../config/config.json');

module.exports = {
    name: 'edit-challenge',
    description: 'This gives **mods** the ability to edit the challenge questions that get asked.',
    aliases: ['editchal', 'editchallenge', 'modify-challenge', 'ec'],
    usage: `${config.prefix}edit-challenge [challenge number] [new question]`,
    challengeMods: 1,
    challenge: 1,
    example: `${config.prefix}ec 5 What type of pizza is Erin\'s favorite?`,
    async execute (message, args) {

        // THIS CURRENTLY DOES NOT LOOK FOR THE CHALLENGE NUMBER. NEED TO UPDATE IT SO THE CHALLNEGE NUMBER IS USED IN THE DB TO FIND THE EXACT ONE THAT NEEDS TO BE UPDATED.
            let day = args[0];
            let title = args.slice(1).join(' ');

            const result = await connection.query(
                `SELECT * FROM Challenge WHERE guildId = ?;`,
                [message.guild.id]
            );
            const msgId = result[0][0].msgId;
            const ch = result[0][0].channelD;
            const channel = message.guild.channels.cache.find(c => c.id === ch);

            const botPermissionsIn = message.guild.members.me.permissionsIn(channel);
            if(!botPermissionsIn.has(Discord.PermissionsBitField.Flags.SendMessages)) return message.author.send(`I can\'t send messages in that channel. I need to have the \`SEND MESSAGES\` permission for that channel. A mod or guild owner will need to update this. If you are seeing this in error, please run the \`${prefix}report\` command.`);

            const botPerms = [Discord.PermissionsBitField.Flags.ManageMessages, Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.ReadMessageHistory, ]
            let v = 0;
            for(const i of botPerms) {
                if(!message.guild.members.me.permissionsIn(channel).has(i)) {
                    v++
                }
                if(v == botPerms.length) {
                    message.react('❌');
                    return message.author.send('I do not have the necessary permissions for this channel. I need \`Manage Messages, Read Message History, View Channel, and Send Messages.\`');
                }
            }

            connection.query(
                `UPDATE Challenge SET title = ? WHERE msgId = ? AND guildId = ?`,
                [title, msgId, message.guild.id]
            );

            let embed = new Discord.EmbedBuilder()
                .setColor(0x848099)
                .setTitle(`Challenge ${day}`)
                .setDescription(`${title}`)
                .setFooter({text:`Run the ${config.prefix}submit to submit answers to this challenge.`});

        channel.messages.fetch(msgId).then(message => {
            if (message) message.edit({ embeds: [embed] });
        });

            message.react('✅');



    }
}