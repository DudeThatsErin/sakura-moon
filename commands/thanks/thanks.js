const connection = require('../../database.js');

module.exports = {
  name: 'thanks',
  aliases: ['thnks', 'tks', 'tx', 'thank'],
  usage: '++thanks <@username or ID>',
  inHelp: 'yes',
  cooldown: 400,
  mentionCooldown: 400,
  example: '++thanks @DudeThatsErin#8061 or ++thanks 455926927371534346',
  note: 'you can now mention more than one user at a time though the number is capped at 4 users mentioned max to prevent ping spam.',
  async execute(message, args, client) {
    
    const mention = message.mentions.users.first();
    
    if (!mention) {
      message.react('❓');
      message.reply('Please tag a user to thank.');
      return;
    }
    const thankee = mention.id;
    const thanker = message.author.id;

    if (mention.ClientUser === true || thankee === message.author.id || thankee === client.user.id) {
      message.reply('It looks like you were trying to thank yourself or a bot in your server. That is not the appropriate way to use this system.');
      return;
    }

    await connection.query(
      `INSERT INTO Thanks (userId, user, thanks) VALUES (?, ?, ?);`,
      [thanker, thankee, 1]
    );

    if (message.mentions.users.first(2)[1]) {
      const secondMention = message.mentions.users.first(2)[1];
      if (secondMention === client.user.id || secondMention === message.author.id || secondMention.ClientUser === true) return message.reply('It looks like you were trying to thank yourself or a bot in your server. That is not the appropriate way to use this system.');
      const thankee2 = secondMention.id;
      await connection.query(
        `INSERT INTO Thanks (userId, user, thanks) VALUES (?, ?, ?);`,
        [thanker, thankee2, 1]
      );
    }
    if (message.mentions.users.first(3)[2]) {
      const thirdUser = message.mentions.users.first(3)[2];
      if (thirdUser === client.user.id || thirdUser === message.author.id || thirdUser.ClientUser === true) return message.reply('It looks like you were trying to thank yourself or a bot in your server. That is not the appropriate way to use this system.');
      const thankee3 = thirdUser.id
      await connection.query(
        `INSERT INTO Thanks (userId, user, thanks) VALUES (?, ?, ?);`,
        [thanker, thankee3, 1]
      );
    }
    if (message.mentions.users.first(4)[3]) {
      const fourthUser = message.mentions.users.first(4)[3];
      if (fourthUser === client.user.id || fourthUser === message.author.id || fourthUser.ClientUser === true) return message.reply('It looks like you were trying to thank yourself or a bot in your server. That is not the appropriate way to use this system.');
      const thankee4 = fourthUser.id;
      await connection.query(
        `INSERT INTO Thanks (userId, user, thanks) VALUES (?, ?, ?);`,
        [thanker, thankee4, 1]
      );
    }

    message.reply(`I have thanked everyone for you. We all appreciate it! Use the \`++thanks-leaderboard\` command in the <#433962402292432896> channel to see where you stand.`)

  }
}
