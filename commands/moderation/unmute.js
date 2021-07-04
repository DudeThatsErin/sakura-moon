module.exports = {
  name: "unmute",
  description: "This will unmute a user. Giving them the ability to speak again.",
  note: '',
  aliases: ['de-mute', 'mm', 'um', 'speak'],
  usage: "s.unmute @username or user ID [reason]",
  example: 's.unmute @DudeThatsErin allowing to speak again',
  inHelp: "yes",
  userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'MANAGE_MEMBERS'],
  botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'MANAGE_MEMBERS'],
  patreonOnly: 'no',
  async execute(message, args) {
    // Defines and logs variables
    const person = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(" ");
    const muterole = message.guild.roles.cache.find(r => r.name === 'Muted');

    // find person
    if (!person) {
      message.react('❌')
      message.reply("Couldn't find that member!");
      return;
    }
    // Requiring reason
    if (reason.length < 1) {
      message.react('❌')
      message.reply('You must supply a reason for to unmute.');
      return;
    }

    // makes sure bot has roles.
    if (!message.guild.me.hasPermission(["MANAGE_MEMBERS"])) {
      message.react('🚫')
      message.channel.send("I do not have the permission to add roles!");
      return;
    }

    if (!muterole) {
      message.react('❓')
      message.reply('Where is the **muted** role? It could not be found!');
      return;
    }

    person.roles.remove(muterole).catch(console.error);
    message.react('✅');
    message.channel.send(`${person} has been unmuted and we were provided this reason: ${reason}.`);

  },
};