const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'userinfo',
    description: 'See info about you or others.',
    aliases: ['user', 'person', 'useri', 'user-info'],
    usage: 's.userinfo <@username or user ID>',
    inHelp: 'yes',
    example: 's.userinfo or s.userinfo @DudeThatsErin#8061',
    note: 'If you want to see information about yourself, just run \`s.userinfo\` without pinging anyone and that will provide information about yourself.',
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
    execute(message, args, client) {
        const member = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        let userinfo = {};
        userinfo.bot = member.bot;
        userinfo.createdat = member.createdAt;
        userinfo.discrim = member.discriminator;
        userinfo.id = member.id;
        userinfo.tag = member.tag;
        userinfo.uname = member.username;
        userinfo.presen = member.presence.status;
        userinfo.avatar = member.displayAvatarURL({
            dynamic: true
        });
        const memberMention = message.mentions.members.first() || message.member;
        const rolesOfTheMember = memberMention.roles.cache.filter(r => r.name !== '@everyone').map(role => role.name).join(', ')

        var myInfo = new Discord.MessageEmbed()
            .setColor(0xf0e5da)
            .setAuthor(userinfo.uname, userinfo.avatar)
            .setTitle("About this user...")
            .setThumbnail(userinfo.avatar)
            .addField("Bot?", userinfo.bot, true)
            .addField("Username", userinfo.uname, true)
            .addField("Discriminator", userinfo.discrim, true)
            .addField("Client ID", userinfo.id, true)
            .addField("Client Tag", userinfo.tag, true)
            .addField('Status', userinfo.presen, true)
            .addField('Joined Discord on', `\`${moment(member.createdAt).format('MMM DD YYYY')}\``, true)
            .addField("Roles", rolesOfTheMember, true)
            .setFooter('If anything is wrong, please report this!', `${message.guild.iconURL({ dynamic: true })}`)

        message.channel.send(myInfo);

    }

};