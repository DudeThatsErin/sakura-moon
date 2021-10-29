const connection = require('../../database.js');

module.exports = {
  name: 'unthanks',
  aliases: ['nothnks', 'untks', 'notx', 'unthank'],
  usage: '++unthanks <@username or ID>',
  cooldown: 0,
  example: '++unthanks @DudeThatsErin#8061 or ++thanks 455926927371534346',
  description: 'Allows mods to remove a thanks from a user.',
  note: 'You must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`\nIt removes one thanks at a time.',
  userPerms: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
  patreonOnly: 'no',
  modOnly: 'yes',
  async execute(message, args) {

    const mention = message.mentions.users.first() || message.guild.members.cache.get(args[0]);


    if (!mention) {
      message.react('❓');
      message.reply('Please tag a user to remove thanks from.');
      return;
    }

    const user = mention.id;

    await (await connection).query(
      `DELETE FROM Thanks WHERE user = ? ORDER BY rowNo desc limit 1;`,
      [user]
    );

    const result3 = await (await connection).query(
      `select sum(cast(thanks as unsigned)) as total from Thanks where user = ?;`,
      [user]
    );
    const no = result3[0][0].total;

    message.react('✅');
    message.reply(`I have removed a thanks from ${mention.username}! They now have ${no} thanks. Use the \`++thanks-leaderboard\` command to see where everyone stands.`)

  }
}