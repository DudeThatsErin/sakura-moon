const connection = require('../../database.js');

module.exports = {
  name: 'thanks',
  aliases: ['thnks', 'tks', 'tx', 'thank'],
  usage: 's.thanks <@username or ID>',
  inHelp: 'yes',
  cooldown: 0,
  example: 's.thanks @DudeThatsErin#8061 or s.thanks 455926927371534346',
  permissions: '',
  note: '',
  patreonOnly: 'no',
  async execute(message, args, client) {

    const result1 = await connection.query(
      `SELECT * from Guilds WHERE guildId = ?;`,
      [message.guild.id]
    );
    const thanks = result1[0][0].thanks;
    if (thanks === '0') {
      message.react('🚫');
      message.channel.send('The thanks system is currently off therefore this command will not work. Please have a mod run `s.thanks-on` to use this command.')
      return;
    }

    const mention = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));


    if (!mention) {
      message.react('❓');
      message.reply('Please tag a user to thank.');
      return;
    }
    const user = mention.id;

    if (mention.user.bot === true || user === message.author.id || user === client.user.id) {
      message.react('🚫');
      message.reply('It looks like you were trying to thank yourself or a bot in your server. That is not the appropriate way to use this system.');
    } else {

      await connection.query(
        `INSERT INTO Thanks (guildId, userId, thanks) VALUES (?, ?, ?);`,
        [message.guild.id, user, 1]
      );

      const result3 = await connection.query(
        `SELECT thanks, SUM(CAST(thanks AS UNSIGNED)) AS total FROM Thanks WHERE guildId = ? AND userId = ?;`,
        [message.guild.id, user]
      );
      const no = result3[0][0].total;

      message.react('💜');
      message.reply(`You thanked ${mention.user.username}! They now have ${no} thanks. Use the \`s.thanks-leaderboard\` command to see where you stand.`)
    }

  }
}