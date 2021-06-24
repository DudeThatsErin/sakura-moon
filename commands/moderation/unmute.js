
module.exports = {
  name: "unmute",
  description: "This will unmute a user. Giving them the ability to speak again.",
  note: 'You have to have the \`MANAGE_MESSAGES\` permission.',
  aliases: ['de-mute', 'mm', 'um', 'speak'],
  usage: "s.unmute @username or user ID [reason]",
  example: 's.unmute @DudeThatsErin allowing to speak again',
  inHelp: "yes",
  permissions: 'MANAGE_MEMBERS',
  async execute (message, args) {
    // Defines and logs variables
    const person = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(" ");
    const muterole = message.guild.roles.cache.find( r => r.name === 'Muted');
    
    // find person
    if (!person) {
      message.reply(":x: Couldn't find that member!");
      return;
    } 
    // Requiring reason
    if (reason.length < 1) {
      message.reply(':x: You must supply a reason for to unmute.');
      return;
    } 
    
    // makes sure bot has roles.
    if(!message.guild.me.hasPermission(["MANAGE_MEMBERS"])) {
      message.channel.send(":no_entry_sign: I do not have the permission to add roles!");
      return;
    }

    if(!muterole) {
        message.reply(':x: Mute role could not be found!');
        return;
    }

    person.roles.remove(muterole).catch(console.error);
    message.channel.send(`:white_check_mark: ${person} has been unmuted and we were provided this reason: ${reason}.`);

  },
};