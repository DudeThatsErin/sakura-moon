const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'userinfo',
    description: 'This allows users to find out more information about themselves or another user they ping or provide the ID for.',
    aliases: ['user', 'person', 'useri', 'user-info'],
    usage: 's.userinfo',
    inHelp:'yes',
    example: 's.userinfo',
    execute (message, args) {
        const member = message.mentions.users.first() || message.author || message.member;
        let userinfo = {};
        userinfo.bot = member.bot;
        userinfo.createdat = member.createdAt;
        userinfo.discrim = member.discriminator;
        userinfo.id = member.id;
        userinfo.tag = member.tag;
        userinfo.nick = message.guild.members.cache.get(member.id).displayName;
        userinfo.uname = member.username;
        userinfo.presen = member.presence.status;
        userinfo.avatar = member.displayAvatarURL({ dynamic: true });
        const memberMention = message.mentions.members.first() || message.member;
        const rolesOfTheMember = memberMention.roles.cache.filter(r => r.name !== '@everyone').map(role => role.name).join(', ')

        var myInfo = new Discord.MessageEmbed()
        .setColor(0xf0e5da)
        .setAuthor(userinfo.uname, userinfo.avatar)
        .setTitle("About this user...")
        .setThumbnail(userinfo.avatar)
        .addField("Bot?",userinfo.bot, true)
        .addField("Username",userinfo.uname, true)
        .addField("Discriminator",userinfo.discrim, true)
        .addField("Nickname:", userinfo.nick, true)
        .addField("Client ID",userinfo.id, true)
        .addField("Client Tag",userinfo.tag, true)
        .addField('Status', userinfo.presen, true)
        .addField('Joined server on', `\`${moment(message.guild.members.cache.get(member.id).joinedAt).format('MMM DD YYYY')}\``, true)
        .addField('Joined Discord on', `\`${moment(member.createdAt).format('MMM DD YYYY')}\``, true)
        .addField("Roles", rolesOfTheMember, true)
        .setFooter('If anything is wrong, please report this!', `${message.guild.iconURL({ dynamic: true })}`)



        message.channel.send(myInfo);
        
    }

};