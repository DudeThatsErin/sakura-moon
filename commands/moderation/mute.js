const Discord = require("discord.js");
const connection = require('../../database.js');

module.exports = {
  name: "mute",
  description: "This will mute users. You can then unmute them with \`s.unmute @username or user ID [reason]\` to unmute them.",
  note: '**IMPORTANT:**The first time you run this it will create a `Muted` role that is a red color. In order for this to work, you need to add this role to all of your channels of your server and remove all `SEND MESSAGES` permissions. Otherwise, this just gives a user a role with a red color and does not do anything else.',
  aliases: ['turnoff', 'off', 'nospeak', 'm'],
  usage: "s.mute @username or user ID [reason]",
  example: 's.mute @DudeThatsErin spamming in the server',
  inHelp: "yes",
  permissions: 'MANAGE_MEMBERS',
  async execute (message, args) {

    const results = await (await connection).query(
      `SELECT * from Patrons;`
    );
  const guilds = results[0][0].guildId;
  if(message.guild.id != guilds) return message.reply('Only patrons have access to mute and unmute users. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon')

    // Defines and logs variables
    const reason = args.slice(1).join(" ");
    const person = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
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
    
    // makes sure bot has roles.
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
    } // end if

    //Set their roles to an empty array to clear them, then add the muted role once all roles were removed successfully
    person.roles.set([]).then(member => member.roles.add(muterole)).catch(console.error);
    message.channel.send(`✅ ${person} has been muted.`);
    console.log('Successful!');
  },
};