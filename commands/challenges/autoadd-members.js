const Discord = require('discord.js');
const connection = require('../../database.js');
const embd = require('../../config/embed.json');

module.exports = {
    name: 'autoadd-members',
    description: 'This allows **mods** to automatically add participants to the Challenges database.',
    aliases: ['auto-add-members', 'autoadd-users', 'aausers', 'aamembers', 'autoadd-participants', 'auto-add-participants', 'autoaddparticipants', 'aaparticipants', 'aaplayers', 'aap', 'aam', 'aau'],
    usage: 's.add-members',
    inHelp: 'yes',
    example: 's.add-members',
    timeout: '45000',
    chlMods: 1,
    mods: 1,
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
                let embed = new Discord.MessageEmbed()
                    .setColor(embd.sugg)
                    .setTitle(`Users with the \`Participants\` role`)
                    .setDescription('Only users that have been online at least once since this bot was last rebooted will be shown here and only a maximum of 2,000 members will appear. Other users can be added using the \`s.manualadd\` command. This command can only be used once per challenge. So if you run it and it misses users, you need to add them by using the \`s.manualadd\` command.');
                for (var i = 0; i < Memberslength; i++) {
                    const members = Members[i];
                    await connection.query(
                        `INSERT INTO chPlayers (guildId, player) VALUES (?, ?);`,
                        [message.guild.id, members]
                    );
                    const name = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag).join('\n'); //works
                    console.log(name);
                    embed.addFields(
                        {name: 'Member Username:', value: name}
                    )
                }


                message.channel.send({ embeds: [embed] });

            }  

    }
}