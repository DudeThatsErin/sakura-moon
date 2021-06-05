const fs = require('fs');
const Discord = require('discord.js');
const SHClient = require('shandler');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Discord.Collection();
const config = require('./config.json');
const GhostPing = require('discord.js-ghost-ping');
client.cooldowns = new Discord.Collection();
const { cooldowns } = client;
let connection;

const options = {
  commandsDir: 'commands', // commands folder path (required)
  showLogs: 'extra', // "extra"|"normal"|null (default: "extra")
  wrapper: false, // defaults to false
  cLogs: true, // logs most of the resolved promises
  autoDelete: true, // Automatically syncs the global application commands
  autoRegister: true // Automatically register commands
}

const handler = new SHClient(client, options);

const commands = [
  {
    name: 'ping',
    description: 'Advises how long I have been online and checks to make sure I can receive commands successfully.',
  },
  {
    name: 'help',
    description: 'Allows you to see all of my commands. Slash and otherwise.',
  },
  {
    name: 'user-info',
    description: 'Allows you to see information about yourself or other users.',
    options:[
      {
          name:'user',
          description:'Who\'s avatar do you want to see? If you don\'t ping anyone, you will get a link to your own avatar.',
          type: 6,
          required: false
      }
    ]
  },
  {
    name: 'server-info',
    description: 'Allows you to see information about this server.',
  },
  {
    name: 'bot-info',
    description: 'Provides information about Sakura Moon to users.',
  },
  {
    name: 'avatar',
    description: 'I will provide links to your avatar or whomever you ping\'s avatar.',
    options:[
      {
          name:'user',
          description:'Who\'s avatar do you want to see? If you don\'t ping anyone, you will get a link to your own avatar.',
          type: 6,
          required: false
      }
    ]
  },
  {
    name: 'prune',
    description: 'Allows **mods** to mass delete messages in a channel.',
    options:[
      {
          name:'number of messages',
          description:'How many messages should I prune?',
          type: 4,
          required: true
      }
  ]
  },
]
const guilds = ['849645937202036757', '821170440571322389'] //for guild specific commands pass an array for guildIDs. If none, will default to global command

console.log('----- LOGGING IN -----')
client.on('ready', () => {
  console.log(`${client.user.tag} is logged in and ready!`);
  console.log('----- LOGS BELOW -----');  

  client.user.setPresence({status: 'dnd', activities: [{ name: 'the server. Run !help to see all of my commands.', type: 'LISTENING' }] });

    //prefixes
    client.guilds.cache.forEach(guild => {
      connection.query(
        `SELECT prefix FROM Guilds WHERE guildId = ?;`,
        [guild.id]
      ).then(result => {
        client.guildCommandPrefixes.set(guild.id, result[0][0].prefix);
      });
    }).catch(err => console.log(err));

    handler.create(commands, guilds);
});

handler.on('interaction', async interaction => {
	console.log(interaction);
});

client.on('message', async message => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  /* -----------------------------------------
  THANKS
  --------------------------------------------
  */
  const results3 = await connection.query(
      `SELECT thanks FROM Guilds WHERE guildId = ?;`,
      [message.guild.id]
    );
    const th = results3[0][0].thanks;
    if(th === 'on') { // if thanks is on
      //prefixes
    const prefix = client.guildCommandPrefixes.get(message.guild.id);
      const thnks = [ 'thanks', 'thnx', 'thank',  'tnx',  'ty', 'Thanks', 'Thank', 'thx'];
      const isthanks = thnks.reduce((alrdyGood, curr) => alrdyGood || message.content.toLowerCase().split(' ').includes(curr), false);
      if(isthanks && !message.content.startsWith(config.client.prefix)) {
        message.reply(`It seems like someone\'s problem was resolved! I\'m glad someone was able to help you! Please use the \`s.thanks <@username or ID>\` command to show your appreciation!`);
      }
  
      if(!message.content.startsWith(prefix)) return;  
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
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
  
      if (!command) return; 
  
      try {
        command.execute(message, args, client);
      } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
      }
    /* ---------------------------------------------
    REGULAR COMMANDS / THANKS SYSTEM OFF
    ------------------------------------------------
    */
    } else { 
      //prefixes
      const prefix = client.guildCommandPrefixes.get(message.guild.id);
      if(!message.content.startsWith(prefix)) return;  
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if(!command) return message.reply('That was an invalid command.');
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
  
      try {
        command.execute(message, args, client);
      } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
      }
    }
}); // end client.on message

/* ---------------------------------
GHOST PINGS & AUDIT LOGS
------------------------------------ */
client.on("channelDelete", async (channel) => {
  console.log(`channel was deleted.`); // audit log stuff goes here.
});

client.on('messageDelete', async message => {

  	// Get audit log channel.
const results = await connection.query(
	`SELECT auditLog FROM Guilds WHERE guildId = ?;`,
	[message.guild.id]
  );
  const logId = results[0][0].auditLog;
  GhostPing.detector("messageDelete", message, {
    title: `Ghost Ping Detected`,
    color: `C0C0C0`,
    footer: `Don't Ghost Ping, smh`,
    picture: `https://i.imgur.com/k6pLhtU.png`,
    channel: logId,
    ignorePerms: ['ADMINISTRATOR', 'MANAGE_MESSAGES']
  });

  // Ignore direct messages
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Let's perform a coherence check here and make sure we got *something*
	if (!deletionLog) return message.guild.channels.cache.get(logId).send(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

	// We now grab the user object of the person who deleted the message
	// Let us also grab the target of this action to double-check things
	const { executor, target } = deletionLog;

	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same author's message
	if (target.id === message.author.id) {
		message.guild.channels.cache.get(logId).send(`A message by ${message.author.tag} was deleted by ${executor.tag}. The message said: ${message.content}`);
	} else {
		message.guild.channels.cache.get(logId).send(`A message by ${message.author.tag} was deleted which said ${message.content}, but we don't know by who.`);
	}
});

client.on('messageUpdate', (oldMessage, newMessage) => { 
  GhostPing.detector('messageUpdate', oldMessage, newMessage)
});

client.on('messageUpdate', async (oldMessage, newMessage) => { 
  // Get audit log channel.
const results = await connection.query(
`SELECT auditLog FROM Guilds WHERE guildId = ?;`,
[oldMessage.guild.id]
);
const logId = results[0][0].auditLog;
GhostPing.detector('messageUpdate', oldMessage, newMessage);

const fetchedLogs = await oldMessage.guild.fetchAuditLogs({
  limit: 1,
  type: 'MESSAGE_UPDATE',
});
// Since we only have 1 audit log entry in this collection, we can simply grab the first one
const updateLog = fetchedLogs.entries.first();

// Let's perform a coherence check here and make sure we got *something*
if (!updateLog) return message.guild.channels.cache.get(logId).send(`A message by ${message.author.tag} was updated, but no relevant audit logs were found.`);

// We now grab the user object of the person who deleted the message
// Let us also grab the target of this action to double-check things
const { executor, target } = updateLog;

// And now we can update our output with a bit more information
// We will also run a check to make sure the log we got was for the same author's message
if (target.id === oldMessage.author.id) {
  oldMessage.guild.channels.cache.get(logId).send(`A message by ${oldMessage.author.tag} was updated by ${executor.tag}. The message said: ${oldMessage.content}. Now it says: ${newMessage.content}`);
} else {
  oldMessage.guild.channels.cache.get(logId).send(`A message by ${oldMessage.author.tag} was updated which said ${oldMessage.content} and now it says ${newMessage.content}, but we don't know by who.`);
}
});

client.on("guildCreate", async guild => { // works!
  try {
    await connection.query(
      `INSERT INTO Guilds (guildId, guildName, ownerID, region, auditLog, prefix, thanks) VALUES(?, ?, ?, ?, ?, ?, ?);`,
      [guild.id, guild.name, guild.ownerID, guild.region, 'off', 's.', 'off']
    );
  } catch(err) {
    console.log(err);
  }
const test = '718253204147798047';
// Get audit log channel.
const results = await connection.query(
  `SELECT auditLog FROM Guilds WHERE guildId = ?;`,
  [test]
  );
  const logId = results[0][0].auditLog;
  console.log(logId);
  const owner = await client.users.fetch(guild.owner.id);
  const name = owner.tag;
  guild.channels.cache.fetch(logId).send(`I have just been added to ${guild.name} by ${name}`);
})

//removed from a server
client.on("guildDelete", async guild => {
const test = '718253204147798047';
// Get audit log channel.
const results = await connection.query(
  `SELECT auditLog FROM Guilds WHERE guildId = ?;`,
  [test]
  );

  const logId = results[0][0].auditLog;
  console.log(logId);
  const owner = await client.users.fetch(guild.owner.id);
  const name = owner.tag;
  guild.channels.cache.fetch(logId).send(`I have just been removed from ${guild.name} by ${name}`);
});

client.on('guildMemberAdd', async (member) => {
// Get audit log channel.
const results = await connection.query(
  `SELECT auditLog FROM Guilds WHERE guildId = ?;`,
  [member.guild.id]
  );
  const logId = results[0][0].auditLog;
const fetchedLogs = await member.guild.fetchAuditLogs({
  limit: 1,
  type: 'MEMBER_KICK',
});
// Since we only have 1 audit log entry in this collection, we can simply grab the first one
const kickLog = fetchedLogs.entries.first();

// Let's perform a coherence check here and make sure we got *something*
if (!kickLog) return guild.channels.cache.get(logId).send(`${member.user.tag} left the guild, most likely of their own will.`);

// We now grab the user object of the person who kicked our member
// Let us also grab the target of this action to double-check things
const { executor, target } = kickLog;

// And now we can update our output with a bit more information
// We will also run a check to make sure the log we got was for the same kicked member
if (target.id === member.id) {
  member.guild.channels.cache.get(logId).send(`${member.user.tag} joined the guild.`);
} else {
  member.guild.channels.cache.get(logId).send(`${member.user.tag} joined the guild, not sure from where though.`);
}
});


client.on('guildMemberRemove', async (member) => {
// Get audit log channel.
const results = await connection.query(
  `SELECT auditLog FROM Guilds WHERE guildId = ?;`,
  [member.guild.id]
  );
  const logId = results[0][0].auditLog;
const fetchedLogs = await member.guild.fetchAuditLogs({
  limit: 1,
  type: 'MEMBER_KICK',
});
// Since we only have 1 audit log entry in this collection, we can simply grab the first one
const kickLog = fetchedLogs.entries.first();

// Let's perform a coherence check here and make sure we got *something*
if (!kickLog) return guild.channels.cache.get(logId).send(`${member.user.tag} left the guild, most likely of their own will.`);

// We now grab the user object of the person who kicked our member
// Let us also grab the target of this action to double-check things
const { executor, target } = kickLog;

// And now we can update our output with a bit more information
// We will also run a check to make sure the log we got was for the same kicked member
if (target.id === member.id) {
  member.guild.channels.cache.get(logId).send(`${member.user.tag} left the guild; kicked by ${executor.tag}?`);
} else {
  member.guild.channels.cache.get(logId).send(`${member.user.tag} left the guild, audit log fetch was inconclusive.`);
}
});

client.on('guildBanAdd', async (guild, user) => {
// Get audit log channel.
const results = await connection.query(
  `SELECT auditLog FROM Guilds WHERE guildId = ?;`,
  [guild.id]
  );
  const logId = results[0][0].auditLog;
const fetchedLogs = await guild.fetchAuditLogs({
  limit: 1,
  type: 'MEMBER_BAN_ADD',
});
// Since we only have 1 audit log entry in this collection, we can simply grab the first one
const banLog = fetchedLogs.entries.first();

// Let's perform a coherence check here and make sure we got *something*
if (!banLog) return guild.channels.cache.get(logId).send(`${user.tag} was banned from ${guild.name} but no audit log could be found.`);

// We now grab the user object of the person who banned the user
// Let us also grab the target of this action to double-check things
const { executor, target } = banLog;

// And now we can update our output with a bit more information
// We will also run a check to make sure the log we got was for the same kicked member
if (target.id === user.id) {
  guild.channels.cache.get(logId).send(`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, wielded by the mighty ${executor.tag}`);
} else {
  guild.channels.cache.get(logId).send(`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, audit log fetch was inconclusive.`);
}
});

client.on('guildBanRemove', async (guild, user) => {
// Get audit log channel.
const results = await connection.query(
  `SELECT auditLog FROM Guilds WHERE guildId = ?;`,
  [guild.id]
  );
  const logId = results[0][0].auditLog;
const fetchedLogs = await guild.fetchAuditLogs({
  limit: 1,
  type: 'MEMBER_BAN_ADD',
});
// Since we only have 1 audit log entry in this collection, we can simply grab the first one
const banLog = fetchedLogs.entries.first();

// Let's perform a coherence check here and make sure we got *something*
if (!banLog) return guild.channels.cache.get(logId).send(`${user.tag} was banned from ${guild.name} but no audit log could be found.`);

// We now grab the user object of the person who banned the user
// Let us also grab the target of this action to double-check things
const { executor, target } = banLog;

// And now we can update our output with a bit more information
// We will also run a check to make sure the log we got was for the same kicked member
if (target.id === user.id) {
  guild.channels.cache.get(logId).send(`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, wielded by the mighty ${executor.tag}`);
} else {
  guild.channels.cache.get(logId).send(`${user.tag} got hit with the swift hammer of justice in the guild ${guild.name}, audit log fetch was inconclusive.`);
}
});


/*
---------------------------------------------------------------------------------------------
END OF FILE
---------------------------------------------------------------------------------------------
*/
  (async () => {
    connection = await require('./database.js');
    await client.login(config.client.token);
  })();