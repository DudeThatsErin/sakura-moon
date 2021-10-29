const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'add-user',
    description: 'This allows **mods** to manually add users to the participants database.',
    aliases: ['add-people', 'adduser'],
    usage: '++add-user',
    inHelp:'yes',
    example: '++add-user 839863262026924083',
    challengeMods: 'yes',
    modOnly: 'yes',
    userPerms: [''],
    botPerms: [''],
    execute (message, args) {
 
            const mmbr = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            const tag = mmbr.user.tag;
            if(!mmbr) {
                message.reply('You need to include a user ID or mention of the user you want to add to the database.');
            } else {
                    let embed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`User I have added to the database`)
                        .setDescription(`${tag}`)
                        .setFooter('Only users that have been online at least once since this bot was last rebooted will be shown here. Other users can be added using the add-participants command.');
                message.channel.send({ embeds: [embed] });
                   connection.query(
                        `INSERT INTO Challenges (guildId, player) VALUES (?, ?);`,
                        [message.guild.id, tag]
                    );
                } 

    }
}