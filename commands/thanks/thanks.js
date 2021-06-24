const connection = require('../../database.js');

module.exports = {
    name: 'thanks',
    aliases: ['thnks', 'tks', 'tx', 'thank'],
    usage: 's.thanks <@username or ID>',
    inHelp: 'yes',
    cooldown: 0,
    example: 's.thanks @DudeThatsErin#8061 or s.thanks 455926927371534346',
    permissions: '',
    note: 'In order for users to be able to use this command, someone from the guild has to support the bot on [Patreon](https://www.patreon.com/SakuraMoon).',
  async execute(message, args, client) {

      const results = await connection.query(
        `SELECT * from Patrons WHERE guildId = ?;`,
        [message.guild.id]
    );
      if(results[0][0] === undefined || results[0][0] === 'undefined') return message.reply('Only patrons have access to use the Challenge System. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');

    const result1 = await connection.query(
      `SELECT * from Guilds WHERE guildId = ?;`,
      [message.guild.id]
    );
    const thanks = result1[0][0].thanks;
    if(thanks === '0') {
      message.channel.send('The thanks system is currently off therefore this command will not work. Please have a mod run `s.thanks-on` to use this command.')
      return;
    }

      const mention = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
       

      if (!mention) {
        message.reply('Please tag a user to thank.');
        return;
      }
      const user = mention.id;

      if(mention.user.bot === true || user === message.author.id || user === client.user.id) { 
        message.reply('It looks like you were trying to thank yourself or a bot in your server. That is not the appropriate way to use this system.');
      }
      else {

        await connection.query(
          `INSERT INTO Thanks (guildId, userId, thanks) VALUES (?, ?, ?);`,
          [message.guild.id, user, 1]
        );
        
        const result3 = await connection.query(
          `SELECT thanks, SUM(CAST(thanks AS UNSIGNED)) AS total FROM Thanks WHERE guildId = ? AND userId = ?;`,
          [message.guild.id, user]
        );
        const no = result3[0][0].total;


      message.reply(`You thanked ${mention.user.username}! They now have ${no} thanks. Use the \`s.thanks-leaderboard\` command to see where you stand.`)
      }

    }
}
