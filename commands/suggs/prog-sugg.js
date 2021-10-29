const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'prog-sugg',
    aliases: ['inprogsugg', 'workingsugg', 'workingsuggestion', 'inprogresssuggestion', 'inprogresssuggestions', 'workingsuggestion', 'worksugg', 'ps', 'ws'],
    inHelp: 'yes',
    description: 'Allows **mods** to mark a particular suggestion as *in progress*.',
    usage: '++prog-sugg messageID [status message]',
    example: '++prog-sugg 847580954306543616 This is the in-progress status for this suggestion.',
    modOnly: 'yes',
    async execute(message, args) {

            const msgId = args[0];
            if(msgId > 0 ) {
                try {
                    const result = await connection.query(
                        `SELECT noSugg from Suggs WHERE noSugg = ?;`,
                        [msgId]
                    );
                    const mId = result[0][0].noSugg;
                    //console.log(mId); same as what I have supplied
                } catch(error) {
                    message.reply('There was an error grabbing the ID from the database. Please report this!');
                    console.log(error);
                }

                // needed so we know who to send the message to.
            const result2 = await connection.query(
                `SELECT Author from Suggs WHERE noSugg = ?;`,
                [msgId],
            );
                const OGauthor = result2[0][0].Author;
                //console.log(OGauthor) //defined & does have the correct ID.... hm...
                let name = await message.guild.members.fetch(OGauthor);
               // console.log(name)
                let tag = name.user.username;
               // console.log(tag)
    
                // needed for embeds
            const result3 = await connection.query(
                `SELECT Message from Suggs WHERE noSugg = ?;`,
                [msgId],
            );
            const suggestion = result3[0][0].Message;
    
                // needed for embeds
            const result4 = await connection.query(
                `SELECT Avatar from Suggs WHERE noSugg = ?;`,
                [msgId],
            );
            const avatar = result4[0][0].Avatar;
    
            const mod = message.author.id;
    
            const stats = args.slice(1).join(' ');
            if(!stats) return message.channel.send('You need to include the status of the suggestion as well as the message ID.');
    
            try {
                connection.query(
                    `UPDATE Suggs SET stat = ?, Moderator = ? WHERE noSugg = ?;`,
                    [stats, mod, msgId],
                );
            } catch (error) {
                message.reply('There was an error updating the suggestion in the database. Please report this!');
                console.log(error);
            }

            const result8 = await connection.query(
                `SELECT stat FROM Suggs WHERE noSugg = ?;`,
                [msgId]
            );
            const upStatus = result8[0][0].stat;
    
            const moderator = await connection.query(
                `SELECT Moderator FROM Suggs WHERE noSugg = ?;`,
                [msgId]
            );
            const moder = moderator[0][0].Moderator;
            const moderate = moder.tag || message.author.tag;
    
            const inprogress = new Discord.MessageEmbed()
                .setColor('004d4d')
                .setAuthor(`${name}`, `${avatar}`)
                .setDescription(`${suggestion}`)
                .addFields(
                    { name: 'Current Status', value: `${upStatus}`},
                    { name: 'The moderator that last updated this was', value: `${moderate}`},
                )
                .setFooter('If you would like to suggest something, use ++suggestions');
                
            const updated = new Discord.MessageEmbed()
                .setColor('3EA493')
                .setAuthor(`${tag}`, `${avatar}`)
                .setDescription(`${suggestion}`)
                .addFields(
                    { name: 'Your suggestion has been updated! This is the current status:', value: `${upStatus}`},
                    { name: 'Moderator that updated your suggestion:', value: `${moder}`},
                )
                .setTimestamp()
                .setFooter('If you don\'t understand this status, please contact the moderator that updated your suggestion. Thank you!');

                (await name.send({ embeds: [updated] }));
            message.channel.send(`✅ I have sent the message to the user and updated the message in the channel.`);

            const chnnel = await message.guild.channels.cache.find(c => c.name === 'suggestions');
            chnnel.messages.fetch(msgId).then(message => {
                if (message) message.edit({ embeds: [inprogress] });
                    if(message) message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                }
            ).catch(console.error);
            }
    }
};