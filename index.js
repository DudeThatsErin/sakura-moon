/*
  SAKURA MOON BOT
  RUNNING DJS 12.5.3
  VERSION 1.5

  CURRENT ISSUE:
    THANKS SYSTEM NOT WORKING FOR PATRONS
    Thanks is undefined on index.js:185:28
*/
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const config = require('./config.json');
const GhostPing = require('discord.js-ghost-ping');
client.cooldowns = new Discord.Collection();
const {
  cooldowns
} = client;
const connection = require('./database.js')
client.guildCommandPrefixes = new Discord.Collection();

function readFilesFromPath(pathString) {
  const directoryEntries = fs.readdirSync(pathString, {
    withFileTypes: true
  });

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

  const time = new Date();
  const startTime = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth()}/${time.getFullYear()} UTC`;
  const channel = client.channels.cache.get('856932105258139688')
  const prf = client.guildCommandPrefixes.get(`${config.bot.server_id} `);

  let ready = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setTitle(`${config.bot.tag} is logged in!`)
    .setDescription(`${config.developer.name}, ${config.bot.name} is online! My current prefix is ${prf}`)
    .addFields({
      name: 'Time',
      value: startTime
    }, {
      name: 'Servers',
      value: `${client.guilds.cache.size} `
    }, {
      name: 'Users',
      value: `${client.users.cache.size}`
    }, {
      name: 'Channels',
      value: `${client.channels.cache.size} `
    })
    .setThumbnail(`${config.bot.avatar}`)
    .setTimestamp()
    .setFooter(`This server ID: ${config.bot.server_id}`, `${config.bot.avatar}`);
  channel.send(ready);

});

client.on('guildCreate', async (guild) => {
  let guildName = guild.name;
  let guildId = guild.id;
  let ownerID = guild.ownerID;
  let ownerName = client.users.cache.get(ownerID).username;
  let discrim = ownerID.discriminator;
  let avatar = ownerID.displayAvatarURL({
    dynamic: true
  });
  let region = guild.region;
  let auditLog = 'off';
  let currentPrefix = 's.';
  let thanks = 'off';
  const channel = client.channels.cache.find(channel => channel.id === '852192258156920853');

  let newGuild = new Discord.MessageEmbed()
    .setColor('#BB41CE')
    .setTitle('I got added to a new guild!')
    .setDescription(`I was just added to a new guild named: ${guildName}`)
    .setThumbnail(avatar)
    .addFields({
      name: 'Guild ID:',
      value: `${guildId}`
    }, {
      name: 'Owner ID:',
      value: `${ownerID}`
    }, {
      name: 'Owner Name:',
      value: `${ownerName}#${discrim}`
    }, {
      name: 'Guild Name:',
      value: `${guildName}`
    }, {
      name: 'Guild Region:',
      value: `${region}`
    }, {
      name: 'Audit Log:',
      value: `${auditLog}`
    }, {
      name: 'Prefix:',
      value: `${currentPrefix}`
    }, {
      name: 'Thanks System',
      value: `${thanks}`
    })
    .setTimestamp()
    .setFooter('I have added this information to the Guilds Database.', 'https://codinghelp.site/bots/sm/neon-moon.jpg')
  channel.send(newGuild)
  try {
    await connection.query(
      `INSERT INTO Guilds (guildId, guildName, ownerID, region, auditLog, prefix, thanks) VALUES(?, ?, ?, ?, ?, ?, ?);`,
      [guildId, guildName, ownerID, region, auditLog, currentPrefix, thanks]
    );
  } catch (err) {
    console.log(err);
  }
});

client.on('guildDelete', async (guild) => {
  const guildResults = await connection.query(
    `SELECT * FROM Guilds WHERE guildId = ?;`,
    [guild.id]
  )
  let guildName = guild.name;
  let guildId = guild.id;
  let ownerID = guild.ownerID;
  let ownerName = client.users.cache.get(ownerID).username;
  let discrim = ownerID.discriminator;
  let avatar = ownerID.displayAvatarURL({
    dynamic: true
  });
  let region = guild.region;
  let auditLog = guildResults[0][0].auditLog;
  let currentPrefix = guildResults[0][0].prefix;
  let thanks = guildResults[0][0].thanks;
  const channel = client.channels.cache.find(channel => channel.id === '852192258156920853');

  let newGuild = new Discord.MessageEmbed()
    .setColor('#BB41CE')
    .setTitle('I got removed from a guild! ☹️')
    .setDescription(`I was just from a a new guild named: ${guildName}`)
    .setThumbnail(avatar)
    .addFields({
      name: 'Guild ID:',
      value: `${guildId}`
    }, {
      name: 'Owner ID:',
      value: `${ownerID}`
    }, {
      name: 'Owner Name:',
      value: `${ownerName}#${discrim}`
    }, {
      name: 'Guild Name:',
      value: `${guildName}`
    }, {
      name: 'Guild Region:',
      value: `${region}`
    }, {
      name: 'Audit Log:',
      value: `${auditLog}`
    }, {
      name: 'Prefix:',
      value: `${currentPrefix}`
    }, {
      name: 'Thanks System',
      value: `${thanks}`
    })
    .setTimestamp()
    .setFooter('I have removed this information from the Guilds Database.', 'https://codinghelp.site/bots/sm/neon-moon.jpg')
  channel.send(newGuild)
  try {
    await connection.query(
      `DELETE FROM Guilds WHERE guildId = ?;`,
      [guildId]
    );
  } catch (err) {
    console.log(err);
  }
});

client.on('message', async message => {
  if (message.author.bot) return;

  if (message.channel.type !== 'dm') {
    //console.log(message); works
    /* -----------------------------------------
    THANKS
    --------------------------------------------
    */
    const results3 = await connection.query(
      `SELECT thanks FROM Guilds WHERE guildId = ?;`,
      [message.guild.id]
    );
    // console.log(results3);  works
    const th = results3[0][0].thanks;
    //console.log(th); 0 or 1 works
    if (th === 'on' || th === '1') { // if thanks is on
      //prefixes
      const prefix = client.guildCommandPrefixes.get(message.guild.id);
      //console.log(prefix) works
      const thnks = ['thanks', 'thnx', 'thank', 'tnx', 'ty', 'Thanks', 'Thank', 'thx'];
      const isthanks = thnks.reduce((alrdyGood, curr) => alrdyGood || message.content.toLowerCase().split(' ').includes(curr), false);
      if (isthanks && !message.content.startsWith(prefix)) {
        message.reply(`It seems like someone\'s problem was resolved! I\'m glad someone was able to help you! Please use the \`s.thanks <@username or ID>\` command to show your appreciation!`);
        console.log('gave thanks')
      }

      if (!message.content.startsWith(prefix)) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if (!command) return message.channel.send('That command does not exist. Run \`s.help\` to see all of my commands.');
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
      }
      //console.log(command); works

      // In your command.js event file.
      const validPermissions = [
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "ADMINISTRATOR",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "PRIORITY_SPEAKER",
        "STREAM",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "VIEW_GUILD_INSIGHTS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "USE_VAD",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS",
      ]

      if (command.ownerOnly === 'yes') {
        if (!message.author.id === config.developer.id) {
          return message.reply('This is only a command Erin (DudeThatsErin#8061) can use. If you are seeing this in error use the `s.report` command.');
        }
      }

      if (command.permissions.length) {
        let invalidPerms = []
        for (const perm of command.permissions) {
          if (!validPermissions.includes(perm)) {
            return console.log(`Invalid Permissions ${perm}`);
          }
          if (!message.member.hasPermission(perm)) {
            invalidPerms.push(perm);
          }
        }
        if (invalidPerms.length) {
          return message.channel.send(`Missing Permissions: \`${invalidPerms}\``);
        }
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
        const embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle('Oh no! An _error_ has appeared!')
          .setDescription(`**Contact Bot Owner:** <@${config.botOwnerID}>`)
          .addFields({
            name: '**Error Name:**',
            value: `\`${error.name}\``
          }, {
            name: '**Error Message:**',
            value: `\`${error.message}\``
          }, {
            name: '**Error Location:**',
            value: `\`${error.stack}\``
          }, {
            name: '**Ways to Report:**',
            value: '[Join My Support Server](https://discord.gg/tT3VEW8AYF), [Fill out this form](https://codinghelp.site/contact-us/) (Erin owns CodingHelp so that form goes directly to her), Message her on Discord, or Email her at me@dudethatserin.site\n\nPlease include all of the information in this embed (message) as well as any additional information you can think to provide. Screenshots are also VERY helpful. Thank you!'
          }, )
          .setTimestamp()
          .setFooter(`Thanks for using ${client.user.tag}! I'm sorry you encountered this error!`, `${client.user.displayAvatarURL()}`)
        message.channel.send(embed);
      }
      /* ---------------------------------------------
      REGULAR COMMANDS / THANKS SYSTEM OFF
      ------------------------------------------------
      */
    } else {
      //prefixes
      const prefix = client.guildCommandPrefixes.get(message.guild.id);
      // console.log(prefix); works
      if (!message.content.startsWith(prefix)) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if (!command) return message.channel.send('That command does not exist. Run \`s.help\` to see all of my commands.');
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
      }
      // console.log(command); works

      // In your command.js event file.
      const validPermissions = [
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "ADMINISTRATOR",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "PRIORITY_SPEAKER",
        "STREAM",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "VIEW_GUILD_INSIGHTS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "USE_VAD",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS",
      ]

      if (command.ownerOnly === 'yes') {
        if (message.author.id !== config.developer.id) {
          return message.reply('This is only a command Erin (DudeThatsErin#8061) can use. If you are seeing this in error use the `s.report` command.');
        }
      }

      if (command.permissions.length) {
        let invalidPerms = []
        for (const perm of command.permissions) {
          if (!validPermissions.includes(perm)) {
            return console.log(`Invalid Permissions ${perm}`);
          }
          if (!message.member.hasPermission(perm)) {
            invalidPerms.push(perm);
          }
        }
        if (invalidPerms.length) {
          return message.channel.send(`Missing Permissions: \`${invalidPerms}\``);
        }
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
        const embed2 = new Discord.MessageEmbed()
          .setColor('RED')
          .setTitle('Oh no! An _error_ has appeared!')
          .setDescription(`**Contact Bot Owner:** <@${config.bot.ownerID}>`)
          .addFields({
            name: '**Error Name:**',
            value: `\`${error.name}\``
          }, {
            name: '**Error Message:**',
            value: `\`${error.message}\``
          }, {
            name: '**Error Location:**',
            value: `\`${error.stack}\``
          }, {
            name: '**Ways to Report:**',
            value: '[Join My Support Server](https://discord.gg/tT3VEW8AYF), [Fill out this form](https://codinghelp.site/contact-us/) (Erin owns CodingHelp so that form goes directly to her), Message her on Discord, or Email her at me@dudethatserin.site\n\nPlease include all of the information in this embed (message) as well as any additional information you can think to provide. Screenshots are also VERY helpful. Thank you!'
          }, )
          .setTimestamp()
          .setFooter(`Thanks for using ${client.user.tag}! I'm sorry you encountered this error!`, `${client.user.displayAvatarURL()}`)
        message.channel.send(embed2);
      }
    }

  }

}); // end client.on message

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."));
client.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"));
client.on("error", e => client.logger.error(e));
client.on("warn", info => client.logger.warn(info));

/* ---------------------------------
GHOST PINGS & AUDIT LOGS
------------------------------------ */
client.on('messageDelete', message => {
  GhostPing.detector("messageDelete", message, {
    channel: `825856708592009216`,
    ignorePerms: ['ADMINISTRATOR', 'MANAGE_MESSAGES']
  })
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  GhostPing.detector('messageUpdate', oldMessage, newMessage)
});




/*
---------------------------------------------------------------------------------------------
END OF FILE
---------------------------------------------------------------------------------------------
*/
client.login(config.bot.token);