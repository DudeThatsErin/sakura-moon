const connection = require('../../database.js');

module.exports = {
    name: 'thanks',
    aliases: ['thnks', 'tks', 'tx', 'thank'],
    usage: 's.thanks <@username or ID>',
    inHelp: 'yes',
    cooldown: 600,
    example: 's.thanks @DudeThatsErin#8061 or s.thanks 455926927371534346',
    async execute(message, args) {
      const results5 = await (await connection).query(
        `SELECT thanks FROM Guilds WHERE guildId = ?;`,
        [message.guild.id]
      );
      const status = results5[0][0].thanks;

      if(status === 'off') {
        message.reply('The Thanks System has not been turned on yet. Please have a mod run \`s.thanks-on\` to turn on the Thanks System. If you are receiving this in error, please report this!');
        return;
      } else {

        const mention = message.mentions.users.first();

        if (!mention) {
          message.reply('Please tag a user to thank.');
          return;
        }
        const user = mention.id;
        if(user === message.author.id) {
          message.reply('You can\'t thank yourself. That is cheating.')
        } else {
        
          await (await connection).query(
            `INSERT INTO Thanks (guildId, userId, thanks) VALUES (?, ?, ?);`,
            [message.guild.id, user, 1]
          );

          const results = await (await connection).query(
            `SELECT thanks, SUM(CAST(thanks AS UNSIGNED)) AS total FROM Thanks WHERE guildId = ? AND userId = ?;`,
            [message.guild.id, user]
          );
          const no = results[0][0].total;
          message.reply(`You thanked ${mention.username}! They now have ${no} thanks. Use the \`++thanks-leaderboard\` command to see where you stand.`)
        
        }
    }

    }
}