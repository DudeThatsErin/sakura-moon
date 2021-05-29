const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const config = require('./config.json');
const GhostPing = require('discord.js-ghost-ping');
client.cooldowns = new Discord.Collection();
const { cooldowns } = client;
let connection;
client.guildCommandPrefixes = new Discord.Collection();

function readFilesFromPath(pathString) {
  const directoryEntries = fs.readdirSync(pathString, {withFileTypes: true});

  return directoryEntries.reduce((filteredEntries, dirEnt) => {
      if (dirEnt.isDirectory()) {
          // If the entry is a directory, call this function again
          // but now add the directory name to the path string.
          filteredEntries.push(...readFilesFromPath(`${pathString}/${dirEnt.name}`))
      } else if (dirEnt.isFile()) {
          // Check if the entry is a file instead. And if so, check
          // if the file name ends with `.js`.
          if (dirEnt.name.endsWith('.js')) {
              // Add the file to the command file array.
              filteredEntries.push(`${pathString}/${dirEnt.name}`);
          }
      }

      return filteredEntries;
  }, []);
}

// Call the read files function with the root folder of the commands and
// store all the file paths in the constant.
const commandFilePaths = readFilesFromPath('./commands');

// Loop over the array of file paths and set the command on the client.
commandFilePaths.forEach((filePath) => {
  const command = require(filePath);

  client.commands.set(command.name, command);
});

console.log('----- LOGGING IN -----')
client.on('ready', () => {
  console.log(`${client.user.tag} is logged in and ready!`);
  console.log('----- I AM IN THESE GUILDS -----');
  let guilds = client.guilds.cache.map(guild => `${guild.name} | ${guild.id}\n`).join("");
  console.log(guilds.toString());
  console.log('----- LOGS BELOW -----');  
      //prefixes
      client.guilds.cache.forEach(guild => {
        connection.query(
          `SELECT prefix FROM Guilds WHERE guildId = ?;`,
          [guild.id]
        ).then(result => {
          client.guildCommandPrefixes.set(guild.id, result[0][0].prefix);
        }).catch(err => console.log(err));
      });

  client.user.setPresence({
    status: "online", 
    activity: {
        name: `the server. Run s.help to see my commands.`,  
        type: "LISTENING" 
    }
  });
  
});

client.on('guildCreate', async (guild) => {
  try {
    await connection.query(
      `INSERT INTO Guilds (guildId, guildName, ownerID, region, auditLog, prefix, modmail, modlog, thanks) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [guild.id, guild.name, guild.ownerID, guild.region, 'off', 's.', 'off', 'off', 'off']
    );
  } catch(err) {
    console.log(err);
  }
});


client.on('message', async message => {
  if (message.author.bot) return;
  /* ------------------------------------------
  MODMAIL
  ---------------------------------------------
  */
 const mainGuild = client.guilds.cache.get('821170440571322389'); // may not need.
 if(message.channel.type === "dm"){ // if in DM for bot.
   if(message.author.bot) return;
   if(message.content.includes("@everyone") || message.content.includes("@here")) return message.author.send('I\'m sorry, but you can not use everyone/here mentions in a modmail  thread.');
   // is there a way I can exclude prefix commands? as in if someone runs s.ping in DMs, can I send a message telling them DMs are only for the modmail system regardless of whether it is on or off?
   
   const modmail = await connection.query(
     `SELECT * FROM Guilds;`
   );
   const embed1 = new Discord.MessageEmbed()
     .setColor('#C87AD5')
     .setTitle('Which server should we open this modmail with?')
     .setDescription('We have received your message and want to open a modmail for you but we aren\'t sure which server we should open the modmail with. Please respond with the corresponding number below to select a server to open a modmail with. For example, respond with 1 to open a modmail with Sakura Moon.')

   for (const row of modmail[0]){
     const guilds = row.guildId;
     const guildName = row.guildName;
     const guildNo = row.serverNo;
     embed1.addField(`${guildNo}. ${guildName}`, `Create a new ticket.\nServer ID:\n\`${guilds}\``, true); // need to figure out how to only display servers both the bot and the user are in. Doing this will limit the number of embeds I need. Hopefully I won't need pagination.
   }
   message.author.send(embed1);
   console.log(message.content);
   // I think I need an if statement to grab the response to the bot. I also think I need to await the response... I'm just not sure how to do this... Reactions could be better but I'm not sure how that would work.
   //console.log(guilds);  need to figure out how to get this to be defined.

   /* this is all temporary... I am going off of this bot: https://github.com/Cyanic76/discord-modmail/blob/master/bot.js and adapting it to my own. I wrote this before I realized I need to get the above working first. 
   const modmail1 = await connection.query(
     `SELECT userId FROM Tickets WHERE guildId = ?;`,
     [message.guild.id]
   ); // current modmails
   let active = `support_${modmail1[0][0].userId}`;
   let channel, found = true;
   const modmail2 = await connection.query(
     `SELECT userId FROM Blacklist WHERE guildId = ?;`,
     [message.guild.id]
   );
   let blacklistedUser = modmail2[0][0].userId;
   if(blacklistedUser !== null || blacklistedUser !== undefined) {
     message.react("❌");
     message.author.send("You are blacklisted from opening modmails. Any DMs you send me just go into the void. If you believe this is wrong, please report this.");
     return;
   }
   if(active === null) {
     active = {};
     let everyone = guild.roles.cache.get(guild.roles.everyone.id);
     let bot = guild.roles.cache.get(); // why do I need this?
     await connection.query(
       `INSERT INTO Tickets (guildId, userId) VALUES (?, ?);`,
       [guild, message.author.id]
     );
     const modmail3 = await connection.query(
       `SELECT * FROM Guilds WHERE guildId = ?;`,
       [guild]
     );
     let modmailCat = modmail3[0][0].modmail;
     let modmailLog = modmail3[0][0].log;
     let modMod = modmail3[0][0].modMod;
     const modmail4 = await connection.query(
       `SELECT ticketNo FROM Tickets WHERE guildId = ?;`,
       [guild]
     );
     let ticketNo = modmail4[0][0].ticketNo;
     let channel = await guild.channels.create(`${message.author.username}-${message.author.discriminator}`,
     {
       type: 'text',
       reason: `New modmail thread.`
     })
   }
   */
 } else { // if not in DM.
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
  }

 }
});

client.on('messageDelete', message => {
  GhostPing.detector("messageDelete", message, {
    title: `Ghost Ping Detected`,
    color: `C0C0C0`,
    footer: `Don't Ghost Ping, smh`,
    picture: `https://i.imgur.com/k6pLhtU.png`,
    channel: `450906618234929152`,
    ignorePerms: ['ADMINISTRATOR', 'MANAGE_MESSAGES']
  })
});

client.on('messageUpdate', (oldMessage, newMessage) => { 
  GhostPing.detector('messageUpdate', oldMessage, newMessage)
});

/*
------------------------------------------
MODMAIL
------------------------------------------
*/
client.on("channelDelete", async (channel) => {
  const res2 = await connection.query(
    `SELECT modmail FROM Guilds WHERE guildId = ?;`,
    [channel.guild.id]
  );
  const modmail = res2[0][0].modmail;
  if (channel.parentID == channel.guild.channels.cache.find((x) => x.id == `${modmail}`).id !== 'off') { // modmail log here.
      const person = channel.guild.members.cache.find((x) => x.id == channel.name)

      if (!person) return;

      let yembed = new discord.MessageEmbed()
          .setAuthor("MAIL DELETED", client.user.displayAvatarURL())
          .setColor('RED')
          .setDescription("Your mail was deleted by a staff member!")
      return person.send(yembed)

  } else {
    console.log(`channel was deleted.`); // audit log stuff goes here.
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