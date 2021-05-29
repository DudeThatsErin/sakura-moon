const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'setup-modmail',
    description: 'This gives **mods** the ability to enable to the Modmail System.\nYou need to provide the *Staff Role ID* which is the ID of the role of the Moderators/Staff that will be working on these Modmails. You also need to provide the name of the category where the modmails will reside.',
    aliases: ['setupmodmail', 'start-modmail', 'startmodmail', 'smodmail', 'smm'],
    usage: 's.setup-modmail <staff role ID> <name of Modmail Category>|<name of ModMail logs channel>',
    example: 's.setup-modmail 751526654781685912 ModMail|Logs',
    inHelp: 'yes',
    async execute (message, args) {

        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
            let roleID = args[0];
            let names = [];
            let catName = args.slice(1).join(' ').split("|")
            let role = message.guild.roles.cache.find((x) => x.id == `${roleID}`);
            let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone");
            const results = await (await connection).query(
                `SELECT modmail FROM Guilds WHERE guildId = ?;`,
                [message.guild.id]
            );
            const modmail = results[0][0].modmail;
            if(!roleID) {
                message.reply('You need to include the ID of the role you want to give access to the ModMail category and channels.');
                return;
            } 
            if(!catName) {
                message.reply('You need to include the name of the ModMail Category and the name of the ModMail Log Channel. These will be separated by \`|\` key which is underneath your backspace key. An example of this command would be:\`\`\`s.setup-modmail 751526654781685912 ModMail|Logs\`\`\`.');
                return;
            }
            if(modmail !== 'off') {
                message.reply('Your ModMail system is already set up. You do not need to run this command now. If you are receiving this message in error, please report this!');
                return;
            }
            else {


                const ch1 = await message.guild.channels.create(`${catName[0]}`, {
                    type: "category",
                    topic: "All of the ModMail Channels",
                    position: 1,
                    permissionOverwrites: [
                        {
                            id: role.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                        },
                        {
                            id: everyone.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                        }
                    ]
                });
                const createdChannel = await message.guild.channels.create(`${catName[1]}`, {
                    type: 'text', //Make sure the channel is a text channel
                    parent: `${ch1.id}`,
                    permissionOverwrites: [
                        {
                            id: role.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                        },
                        {
                            id: everyone.id,
                            deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                        }
                    ]
                });
                const ch2 = createdChannel;

                (await connection).query(
                    `UPDATE Guilds SET modmail = ?, modlog = ? WHERE guildId = ?;`,
                    [ch1.id, ch2.id, message.guild.id]
                );

                message.channel.send("Setup is Completed ✅");

                createdChannel.send('This is where all of the logs for your ModMails will go, if you are seeing this, the channel was set up successfully!')
            }
        }
    }
};