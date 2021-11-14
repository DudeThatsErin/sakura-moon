module.exports = {
    name: 'unban',
    description: 'Allows **mods** to unban a user that was previously banned.',
    aliases: ['allow', 'ban-remove', 'banremove'],
    usage: 's.unban @username <optional reason>',
    example: 's.unban @DudeThatsErin forgiven for spamming',
    inHelp: 'yes',
    note: 'You & I must have the \`BAN_MEMBERS\` permission to run this command. I also cannot ban members that have their role above mine on the list of roles.',
    patreonOnly: 'no',
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'BAN_MEMBERS'],
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'BAN_MEMBERS'],
    execute(message, args) {
        // variables
        const userID = args[0];
        let reason = args.join(" ").slice(1);

        // do something if variables do not exist
        if (!reason) reason = "**No reason given**";

        message.guild.members.unban(userID).then(() => {
            message.react('✅');
            message.reply(`unbanned <@${userID}>`);
        }).catch(err => {
            message.react('❌')
            message.reply('I was unable to unban the member.');
            console.log(err);
        })
    }
}