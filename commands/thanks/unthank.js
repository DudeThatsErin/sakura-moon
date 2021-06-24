const connection = require('../../database.js');

module.exports = {
    name: 'unthanks',
    aliases: ['nothnks', 'untks', 'notx', 'unthank'],
    usage: 's.unthanks <@username or ID>',
    inHelp: 'yes',
    cooldown: 0,
    example: 's.unthanks @DudeThatsErin#8061 or s.thanks 455926927371534346',
    description: 'Allows mods to remove a thanks from a user.',
    note: 'In order for mods to be able to use this command, someone from the guild has to support the bot on [Patreon](https://www.patreon.com/SakuraMoon).',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    async execute(message, args, client) {

      const results = await connection.query(
        `SELECT * from Patrons WHERE guildId = ?;`,
        [message.guild.id]
    );
      if(results[0][0] === undefined || results[0][0] === 'undefined') return message.reply('Only patrons have access to use the Challenge System. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');
        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
        const mention = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));;
        const user = mention.id;

      if (!mention) {
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

      message.reply(`I have removed a thanks from ${mention.user.username}! They now have ${no} thanks. Use the \`s.thanks-leaderboard\` command to see where everyone stands.`)
        }

    }
}
