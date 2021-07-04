module.exports = {
  name: 'unthanks',
  aliases: ['nothnks', 'untks', 'notx', 'unthank'],
  usage: 's.unthanks <@username or ID>',
  inHelp: 'yes',
  cooldown: 0,
  example: 's.unthanks @DudeThatsErin#8061 or s.thanks 455926927371534346',
  description: 'Allows mods to remove a thanks from a user.',
  note: 'You must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`\nIt removes one thanks at a time.',
  permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
  patreonOnly: 'no',
  async execute(message, args) {

    const mention = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));;
    const user = mention.id;

    if (!mention) {
      message.react('❓');
      message.reply('Please tag a user to remove thanks from.');
      return;
    }

    await (await connection).query(
      `DELETE FROM Thanks WHERE guildId = ? AND userId = ? ORDER BY rowNo desc limit 1;`,
      [message.guild.id, user]
    );

    const result3 = await (await connection).query(
      `SELECT thanks, SUM(CAST(thanks AS UNSIGNED)) AS total FROM Thanks WHERE guildId = ? AND userId = ?;`,
      [message.guild.id, user]
    );
    const no = result3[0][0].total;

    message.react('✅');
    message.reply(`I have removed a thanks from ${mention.user.username}! They now have ${no} thanks. Use the \`s.thanks-leaderboard\` command to see where everyone stands.`)

  }
}