const Discord = require('discord.js');
const moment = require('moment');
const filterLevels = {
    DISABLED: 'Off',
    MEMBERS_WITHOUT_ROLES: 'No Role',
    ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
};

module.exports = {
    name: 'serverinfo',
    description: 'This allows users to find out more information about the server they run this command in.',
    aliases: ['server', 'club', 'serveri', 'server-info'],
    usage: 's.serverinfo',
    inHelp: 'yes',
    example: 's.serverinfo',
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
    execute(message, args) {
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = message.guild.members.cache;
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;

        let serverEmbed = new Discord.MessageEmbed()
            .setColor('#CDC9CE')
            .setDescription(`**Server Info**`)
            .setThumbnail(message.guild.iconURL({
                dynamic: true
            }))
            .addFields({
                    name: '**Name & ID:**',
                    value: `${message.guild.name} - \`${message.guild.id}\``,
                    inline: true
                }, {
                    name: '**Owner:**',
                    value: `${message.guild.owner.user.tag} - \`${message.guild.ownerID}\``,
                    inline: true
                }, {
                    name: '**Region:**',
                    value: `${regions[message.guild.region]}`,
                    inline: true
                }, {
                    name: '**Boost Tier:**',
                    value: `${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
                    inline: true
                }, {
                    name: '**Explicit Filter:**',
                    value: `${filterLevels[message.guild.explicitContentFilter]}`,
                    inline: true
                }, {
                    name: '**Verification Level:**',
                    value: `${verificationLevels[message.guild.verificationLevel]}`,
                    inline: true
                }, {
                    name: '**Boost Count:**',
                    value: `${message.guild.premiumSubscriptionCount || '0'}`,
                    inline: true
                }, {
                    name: '**Time Created:**',
                    value: `${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} [${moment(message.guild.createdTimestamp).fromNow()}]`,
                    inline: true
                }, {
                    name: '**Role Count:**',
                    value: `${roles.length}`,
                    inline: true
                }, {
                    name: '**Emoji Count:**',
                    value: `${emojis.size}`,
                    inline: true
                }, {
                    name: '**Regular Emoji Count:**',
                    value: `${emojis.filter(emoji => !emoji.animated).size}`,
                    inline: true
                }, {
                    name: '**Animated Emoji Count:**',
                    value: `${emojis.filter(emoji => emoji.animated).size}`,
                    inline: true
                }, {
                    name: '**Member Count:**',
                    value: `${message.guild.memberCount}`,
                    inline: true
                }, {
                    name: '**Text Channels:**',
                    value: `${channels.filter(channel => channel.type === 'text').size}`,
                    inline: true
                }, {
                    name: '**Voice Channels:**',
                    value: `${channels.filter(channel => channel.type === 'voice').size}`,
                    inline: true
                },

            )
            .setTimestamp()
            .setFooter('If anything is wrong, please report this!', `${message.guild.iconURL({ dynamic: true })}`);
        message.channel.send(serverEmbed);
    }
}