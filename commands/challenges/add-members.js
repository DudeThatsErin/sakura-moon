const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'add-members',
    description: 'This allows **mods** to automatically add participants to the Challenges database.',
    aliases: ['addppl', 'addparticipants', 'addchallengers', 'ap', 'add-participants'],
    usage: 's.add-members',
    inHelp: 'yes',
    example: 's.add-members',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    note: 'In order for mods to use this command, someone from the Guild needs to support Sakura Moon on [Patreon](https://www.patreon.com/SakuraMoon) and they need to have one of the following permissions:\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`.',
    async execute (message, args) {

      const results = await connection.query(
        `SELECT * from Patrons WHERE guildId = ?;`,
        [message.guild.id]
    );
      if(results[0][0] === undefined || results[0][0] === 'undefined') return message.reply('Only patrons have access to use the Challenge System. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
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
                    await (await connection).query(
                        `INSERT INTO Challenges (guildId, player) VALUES (?, ?);`,
                        [message.guild.id, members]
                    );
                }
                const name = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag).join('\n'); //works
                let embed = new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle(`Users with the \`Participants\` role`)
                    .setDescription(`${name}`)
                    .setFooter('Only users that have been online at least once since this bot was last rebooted will be shown here and only a maximum of 2,000 members will appear. Other users can be added using the s.manualadd command.');
                message.channel.send(embed);               

            }
        }    

    }
}
