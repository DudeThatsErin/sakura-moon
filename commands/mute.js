const Discord = require("discord.js");

module.exports = {
  name: "mute",
  description: "This will mute users.\n**Note:** You have to have the MANAGE_MESSAGES permission to use this command.",
  aliases: ['turnoff', 'off', 'nospeak', 'm'],
  usage: "s.mute @username or user ID [length of time] [reason]",
  example: 's.mute @DudeThatsErin 60 spamming in the server',
  inHelp: "yes",
  execute (message, args) {

    // Defines and logs variables
    const reason = args.slice(2).join(" ");
    console.log('reason:' + reason);
    const person = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    console.log('user:' + person);
    const cachedUserRoles = {};
    console.log('user roles are cached.');
    const muterole = message.guild.roles.cache.find( r => r.name === 'Muted');

    // find person
    if (!person) {
      message.reply(":x: Couldn't find that member!");
      return;
    } 
    // Requiring reason
    if (reason.length < 1) {
      message.reply('You must supply a reason for the mute.');
      return;
    } 
    
    // makes sure bot and user have roles.
    if(!message.member.hasPermission("MANAGE_MEMBERS")) {
      message.channel.send(":no_entry_sign: You do not have the permission to use this command!");
      return;
    } 

    if(!message.guild.me.hasPermission(["MANAGE_MEMBERS"])) {
      message.channel.send(":no_entry_sign: I do not have the permission to add roles!");
      return;
    }

    //finds role and if it isn't there, creates it.
    if (!muterole) {
      try {
        muterole = message.guild.roles.create({
          data: {
            name:'Muted',
            color: 'RED',
            permissions: []
          },
          reason: 'Need a role for muted users.',
        });
        message.guild.channels.forEach((channel, id) => {
          channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            MANAGE_MESSAGES: false,
            ADD_REACTIONS: false,
            CONNECT: false,
          });
        });
      }catch(e) { console.log(e.stack); }
      console.log('role created!');
    } // end if

    //Cache their already existing roles
    cachedUserRoles[person.id] = person.roles.cache;

    //Set their roles to an empty array to clear them, then add the muted role once all roles were removed successfully
    person.roles.set([]).then(member => member.roles.add(muterole)).catch(console.error);
    message.channel.send(`${person} has been muted.`);
    console.log('Successful!');
  },
};