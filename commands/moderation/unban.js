
module.exports = {
    name: 'unban',
    description: 'Allows **mods** to unban a user that was previously banned.',
    aliases: ['allow', 'ban-remove', 'banremove'],
    usage: 's.unban @username <optional reason>',
    example: 's.unban @DudeThatsErin forgiven for spamming',
    inHelp: 'yes',
    permissions: 'BAN_MEMBERS',
    async execute(message, args, client) {
        const userID = args[0];
        let reason = args.join(" ").slice(1);
        if (!reason) reason = "**No reason given**";
        if(message.member.hasPermission('BAN_MEMBERS')) {
            message.guild.members.unban(userID).then( () => {
                message.reply(`✅ unbanned <@${userID}>`);
            }).catch(err => {
                message.reply('I was unable to unban the member.');
                console.log(err);
            })
        } else {
            message.channel.send('You do not have permission to do that!')
        }
    }
}