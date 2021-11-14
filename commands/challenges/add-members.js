const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'add-members',
    description: 'This allows **mods** to automatically add participants to the Challenges database.',
    aliases: ['addppl', 'addparticipants', 'addchallengers', 'ap', 'add-participants'],
    usage: 's.add-members',
    inHelp: 'yes',
    example: 's.add-members',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_ROLES', 'MANAGE_NICKNAMES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
    async execute (message, args) {

            let joinersRole = message.guild.roles.cache.find(r => r.name === "Participants") || "none";
            if(joinersRole === "none") {
                message.reply('You need to create a role named \`Participants\` first and give it to users first before you run this command. If you have a role like this, make sure it is named \`Participants\` exactly like that or else this command will not work! If you still have issues, please report this to my developer!');
                return;
            } else {
                const Role = message.guild.roles.cache.find(role => role.name == "Participants");
                const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.id); // array of IDs
                var Memberslength = Members.length;
                for (var i = 0; i < Memberslength; i++) {
                    const members = Members[i];
                    await connection.query(
                        `INSERT INTO chPlayers (guildId, player) VALUES (?, ?);`,
                        [message.guild.id, members]
                    );
                }
                const name = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag).join('\n'); //works
                let embed = new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle(`Users with the \`Participants\` role`)
                    .setDescription(`${name}`)
                    .setFooter('Only users that have been online at least once since this bot was last rebooted will be shown here and only a maximum of 2,000 members will appear. Other users can be added using the s.manualadd command.');
                message.channel.send({ embeds: [embed] });

            }  

    }
}