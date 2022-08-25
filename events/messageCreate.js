const me = require('../config/dev.json');
const Discord = require('discord.js');
const connection = require('../database.js')

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {

        const stuff = await connection.query(
            `SELECT * FROM guildConfig WHERE guildId = ?;`,
            [message.guild.id]
        );
        const prefix = stuff[0][0].prefix;
        const ownerId = stuff[0][0].ownerId;

        //console.log(message);
        //console.log('My ID should match this: 455926927371534346', message.mentions.repliedUser.id); // how I get the user ID on new replies.

        // delete slash commands
        //message.guild.commands.set([])
        //console.log(await message.guild.commands.fetch());
        client.cooldowns = new Discord.Collection();
        const { cooldowns } = client;

        if (message.author.bot) {
            //console.log('bot message');
            return;
        };
        if (!message.content.startsWith(prefix)) {
            //console.log('does not start with prefix.');
            return;
        };
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.channel.send({ content: `That command does not exist. Run \`${prefix}help\` to see all of my commands.` });
        //console.log(command);

        // makes sure the bot can send messages in the channel this is ran in.
        const channel = client.channels.cache.get(message.channel.id);
        const botPermissionsIn = message.guild.members.me.permissionsIn(channel);
        if(!botPermissionsIn.has(Discord.PermissionsBitField.Flags.SendMessages)) return message.author.send(`I can\'t send messages in that channel. I need to have the \`SEND MESSAGES\` permission for that channel. A mod or guild owner will need to update this. If you are seeing this in error, please run the \`${prefix}report\` command.`);

        const botPerms = [Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.ReadMessageHistory, ]
        let v = 0;
        for(const i of botPerms) {
            if(!message.guild.members.me.permissionsIn(channel).has(i)) {
                v++
            }
            if(v == botPerms.length) {
                message.react('❌');
                return message.author.send('I do not have the necessary permissions for this channel. I need \`Read Message History, View Channel, and Send Messages.\`');
            }
        }

        // owner only
        if (command.ownerOnly === 1) {
            if (!message.author.id === ownerId) {
                return message.reply({ content: `This is a command only the server/guild owner can use. If you are seeing this in error use the \`${prefix}report\` command.` });
            }
        }

        //erin/dev only
        if (command.devOnly === 1) {
            if (!message.author.id === me.id) {
                return message.reply({ content: `This is a command only the server/guild owner can use. If you are seeing this in error use the \`${prefix}report\` command.` });
            }
        }

        //moderator only commands (if roles have been provided)
        const mod = await connection.query(`SELECT * FROM guildModIds WHERE guildId = ?;`, [message.guild.id]);
        if (mod != undefined) {
            if(command.modOnly === 1) {
                for (i = 0; i < mod[0].length; i++) {
                    const data = mod[0];
                    const role = data[i].modId;
                    const roleName = message.guild.roles.cache.get(role);

                    roleNames += `${i + 1}. ${roleName}\n`;

                    if (!message.member.permissions.has(role)) {
                        i++
                    }
                    if (value == mod.length) {
                        let embed = EmbedBuilder()
                            .setColor(0xFFB6C1)
                            .setTitle('You do not have one of the required roles...')
                            .addFields(
                                {
                                    name: 'You need one of these roles:',
                                    value: roleNames,
                                    inline: true
                                }
                            )
                        message.react('❌');
                        message.reply({ embeds: [embed] });
                        return;
                    }
                }


            }
        } else {
            //moderator only command (people who have these perms; if roles have not been provided)
            const modPerms = [Discord.PermissionsBitField.Flags.KickMembers, Discord.PermissionsBitField.Flags.ManageMembers, Discord.PermissionsBitField.Flags.BanMembers, Discord.PermissionsBitField.Flags.ManageRoles, Discord.PermissionsBitField.Flags.Administrator];
            let value = 0;
            if(command.modOnly === 1) {
                if (message.author.id !== ownerId) {
                    console.log(message.author.id);
                    constole.log(ownerId)
                    return message.reply({ content: `This is a command only moderators and guild/server owners can use. You do not have the required permissions. The guild/server owner has not provided me with the roles that your guild considers moderators so I fall back on basic permissions in that case. The permissions you need are \`KICK MEMBERS, MANAGE MEMBERS, BAN MEMBERS, OR MANAGE ROLES\`. Please run \`${prefix}report\` if you are seeing this in error. If you would like to provide me with roles, your guild/server owner needs to run the command \`${prefix}addmodrole [ping roles or use role IDs here]\`.` });
                }
                for (const ID of modPerms) {
                    if (!message.member.permissions.has(ID)) {
                        console.log(value)
                        console.log(modPerms)
                        value++
                    }
                    if (value == modPerms.length) {
                        message.react('❌');
                        message.reply({ content: `This is a command only moderators can use. You do not have the required permissions. The roles you need are \`KICK MEMBERS, MANAGE MEMBERS, BAN MEMBERS, OR MANAGE ROLES\`. Please run \`${prefix}report\` if you are seeing this in error.` });
                        return;
                    }
                }
            }
        }

        // makes sure the suggestions system is enabled
        if (command.suggest === 1) {
            const s = await connection.query(`SELECT suggestionsEnabled FROM guildConfig WHERE guildId = ?;`, [message.guild.id]);
            const enabled = s[0][0].suggestionsEnabled;
            if (enabled === 0) {
                message.react('❌');
                message.reply({ content: `The suggestions system has not been enabled yet. Your guild/server owner needs to run \`${prefix}enable-suggestions\` to enable the system. If you are seeing this in error please report this!` });
                return;
            }
        }

        // makes sure the challenge system is enabled
        if (command.challenge === 1) {
            const c = await connection.query(`SELECT challengesEnabled FROM guildConfig WHERE guildId = ?;`, [message.guild.id]);
            const enabled = c[0][0].challengesEnabled;
            if (enabled === 0) {
                message.react('❌');
                message.reply({ content: `The challenges system has not been enabled yet. Your guild/server owner needs to run \`${prefix}enable-challenges [ping or use role ID here]\` to enable the system and add the specific roles that will moderate the challenges to the system. If you are seeing this in error, please report this!`});
                return;
            }
        }

        // makes sure the user running the command is a challenge moderator.
        if (command.challengemods === 1) {
            const ch = await connection.query(`SELECT * FROM chModIds WHERE guildId = ?;`, [message.guild.id]);
            const chllmod = ch[0][0].chModIds;
            if (chllmod === 0 || chllmod === undefined) return message.reply(`There are no challenge moderator roles in the challenge database. Your guild/server owner needs to run \`${prefix}acmr [ping or use role ID here]\` to add the roles to the system. Please run \`${prefix}report [issue]\` if you are seeing this in error.`);
            for (const id of chllmod) {
                if (!message.member.roles.cache.has(id)) {
                    value++
                }
                if (value == chllmod.length) {
                    message.react('❌');
                    message.reply({ content: `This is a command only challenge moderators can use. you do not have the required permissions. challenge moderators have the <@&${chllmod[1]}> role. Please run \`${prefix}report [issue]\` if you are seeing this in error.` });
                    return;
                }
            }
        }

        const partsresults = await connection.query(
            `SELECT * FROM Challenges WHERE guildid = ?;`,
            [message.guild.id]
        );
        if(command.partsonly === 1) {
            for(const id of partsresults.player) {
                if(message.member.id == id) {
                    value++
                }
                if(value == partsresults.player.length) {
                    message.react('❌');
                    message.reply({ content: `This is a command only challenge participants can use. you do not have the required role. participants have the \`participants\` role. if there is an issue, please report this to the challenge moderators.`})
                }
            }
        }


        // command cooldowns
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 1) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply({content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`});
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // actually running the commands.
        try {
            command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel('Erin\'s Support Server')
                        .setStyle('Link')
                        .setURL('https://discord.gg/tT3VEW8AYF'),
                    new Discord.ButtonBuilder()
                        .setLabel('Fill out this form!')
                        .setStyle('Link')
                        .setURL('https://dudethatserin.com')
                )
            const embed = {
                color: 0xFF0000,
                title: 'Oh no! An _error_ has appeared!',
                description: `**Contact Bot Owner:** <@${me.id}>`,
                fields: [
                    {
                        name: '**Error Name:**',
                        value: `\`${error.name}\``
                    }, {
                        name: '**Error Message:**',
                        value: `\`${error.message}\``
                    }, {
                        name: '**Ways to Report:**',
                        value: `Run the \`${prefix}report\` command, Message Erin on Discord, or use one of the links below.\n\nPlease include all of the information in this embed (message) as well as any additional information you can think to provide. Screenshots are also VERY helpful. Thank you!`
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: `Thanks for using ${client.user.tag}! I'm sorry you encountered this error!`,
                    icon_url: `${client.user.displayAvatarURL()}`
                }
            };
            message.channel.send({ embeds: [embed], components: [row] });
        }
    }
}// end client.on message