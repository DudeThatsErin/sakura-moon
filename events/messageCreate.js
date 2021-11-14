const config = require('../config/config.json');
const Discord = require('discord.js');
const bot = require('../config/bot.json');
const embed = require('../config/embed.json');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        //console.log(message);

        if (message.author.bot) {
            //console.log('bot message');
            return;
        };
        if (!message.content.startsWith(config.prefix)) {
            //console.log('does not start with prefix.');
            return;
        };
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.channel.send(`That command does not exist. Run \`${config.prefix}help\` to see all of my commands.`);
        //console.log(command);

        // owner only
        if (command.ownerOnly === 'yes') {
            if (!message.author.id === bot.ownerID) {
                return message.reply(`This is only a command Erin (<@${bot.ownerID}>) can use. If you are seeing this in error use the \`${config.prefix}report\` command.`);
            }
        }

        const thisguild = message.guild;
        if (command.botPerms.length > 0) {
            let botChannelPermissions = message.channel.permissionsFor(client.user);
            botChannelPermissions = new Discord.Permissions(botChannelPermissions.bitfield);
            if (!botChannelPermissions.has(command.botPerms)) {
                let missingPermissions = command.botPerms.filter(perm => botChannelPermissions.has(perm) === false).join(', ');
                let currentPermissions = command.botPerms.filter(perm => botChannelPermissions.has(perm) === true).join(', ');
                console.error(`I can\'t execute the ${command.name} command because ${bot.name} is missing permissions these perms: ${missingPermissions}.\nIt currently have these perms: ${currentPermissions}.`);
                const botPermsEmbed = new Discord.MessageEmbed()
                    .setColor(embed.error)
                    .setTitle('Oh no! An _error_ has appeared!')
                    .setThumbnail('https://i.kym-cdn.com/entries/icons/facebook/000/027/475/Screen_Shot_2018-10-25_at_11.02.15_AM.jpg')
                    .setDescription(`This error happened in **${message.guild.name}** with the ID \`${message.guild.id}\``)
                    .addFields({
                        name: '**Error Name:**',
                        value: `\`BOT IS MISSING PERMISSIONS\``
                    }, {
                        name: '**Error Message:**',
                        value: `${bot.name} is missing these permissions for this command:\n\`\`\`${missingPermissions}\`\`\``
                    }, {
                        name: '**Message That Triggered Error:**',
                        value: `\`\`\`Message Content: ${message.content}\nBy: ${message.author.tag} - ${message.author.id}\nLocated in the Channel: ${message.channel.name}\nChannel ID: ${message.channel.id}\nMessage ID: ${message.id}\`\`\``
                    }, {
                        name: `**${bot.name}\'s Current Roles:**`,
                        value: `\`\`\`${currentPermissions}\`\`\``
                    })
                    .setTimestamp()
                    .setFooter(`Thanks for using ${client.user.tag}! I'm sorry you received this error!`, `${client.user.displayAvatarURL()}`);
                message.reply({ content: `The bot does not have the correct permissions. Please make sure the bot has these perms:\`\`\`${missingPermissions}\`\`\` It is giving you this error becauuse these are the current perms it has:\`\`\`${currentPermissions}\`\`\` If there is an issue, the developer <@${bot.ownerID}> has already been notified.` });
                client.users.cache.get(bot.ownerID).send({ embeds: [botPermsEmbed] });
                message.react('❌');
                return;
            }
        }

        if (command.userPerms.length > 0) {
            let memberChannelPermissions = message.channel.permissionsFor(message.member);
            memberChannelPermissions = new Discord.Permissions(memberChannelPermissions.bitfield);
            if (!memberChannelPermissions.has(command.userPerms)) {
                let missingPermissions = command.userPerms.filter(perm => memberChannelPermissions.has(perm) === false).join(', ');
                let currentPermissions = command.botPerms.filter(perm => memberChannelPermissions.has(perm) === true).join(', ');
                console.error(`I can\'t execute the ${command.name} command because ${message.author.tag} with ID of ${message.author.id} is missing permissions these perms: ${missingPermissions}.\nThey currently have these perms: ${currentPermissions}.`);
                const userPermsEmbed = new Discord.MessageEmbed()
                    .setColor(embed.error)
                    .setTitle('Oh no! An _error_ has appeared!')
                    .setThumbnail('https://i.kym-cdn.com/entries/icons/facebook/000/027/475/Screen_Shot_2018-10-25_at_11.02.15_AM.jpg')
                    .setDescription(`This error happened in **${message.guild.name}** with the ID \`${message.guild.id}\``)
                    .addFields({
                        name: '**Error Name:**',
                        value: `\`MISSING PERMISSIONS\``
                    }, {
                        name: '**Error Message:**',
                        value: `${message.author.tag} is missing these permissions for this command:\n\`\`\`${missingPermissions}\`\`\``
                    }, {
                        name: '**Message That Triggered Error:**',
                        value: `\`\`\`Message Content: ${message.content}\nBy: ${message.author.tag} - ${message.author.id}\nLocated in the Channel: ${message.channel.name}\nChannel ID: ${message.channel.id}\nMessage ID: ${message.id}\`\`\``
                    }, {
                        name: `**${message.author.username}\'s Current Roles:**`,
                        value: `\`\`\`${currentPermissions}\`\`\``
                    }, {
                        name: '**Ways to Fix:**',
                        value: 'In order to resolve this error, a moderator needs to go into either this channel or their server\'s role settings and give you the permissions that she is stating you are missing above. If they aren\'t sure how to do that, you can give them [this link](https://support.discord.com/hc/en-us/articles/206029707-How-do-I-set-up-permissions-).'
                    })
                    .setTimestamp()
                    .setFooter(`Thanks for using ${client.user.tag}! I'm sorry you received this error!`, `${client.user.displayAvatarURL()}`);
                client.users.cache.get(bot.ownerID).send({ embeds: [userPermsEmbed] });
                message.react('❌');
                message.reply(`You do not have the required permissions. If your DMs are open, I have sent you a DM on the matter. Just in case you don\'t have your DMs open, the permissions you need are:\n\`\`\`${missingPermissions}\`\`\` and your current permissions are:\n\`\`\`${currentPermissions}\`\`\`If you feel you are receiving this message in error, rest assured that the developer has already been notified.`);
                return;
            }
        }

        // command cooldowns
        client.cooldowns = new Discord.Collection();
        const { cooldowns } = client;
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
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


        // actually running the commands.
        try {
            command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Oh no! An _error_ has appeared!')
                .setDescription(`**Contact Bot Owner:** <@${bot.ownerID}>`)
                .setThumbnail('https://omg.network/wp-content/uploads/2021/05/5.9_OMG_Token_Black_Circle_White_Text_White_Edge.png')
                .addFields({
                    name: '**Error Name:**',
                    value: `\`${error.name}\``
                }, {
                    name: '**Error Message:**',
                    value: `\`${error.message}\``
                }, {
                    name: '**Error Location:**',
                    value: `\`\`\`${error.stack}\`\`\``
                }, {
                    name: '**Guild Location:**',
                    value: `\`${message.guild.id}\` - ${message.guild.name}`,
                    inline: true
                }, {
                    name: `**Message Author Info:**`,
                    value: `\`${message.author.id}\` - ${message.author.tag}`,
                    inline: true
                }, {
                    name: `**Message Info:**`,
                    value: `**Message Content:**\n\`\`\`${message.content}\`\`\`**Message ID:** \`${message.id}\`\n**Channel:** \`${message.channel.id}\` - ${message.channel.name}`
                })
                .setTimestamp()
                .setFooter(`Thanks for using ${client.user.tag}! I'm sorry you encountered this error!`, `${client.user.displayAvatarURL()}`)
            client.users.cache.get(bot.ownerID).send({ embeds: [embed] });
            message.channel.send('There was an error. The developer has been notified of this error. This will be fixed as soon as possible. Please try again later.');
        }
    }
}// end client.on message