const { MessageEmbed } = require('discord.js');
const config = require('../../config/config.json');

module.exports = {
  name: 'ping',
  description: 'Makes sure the bot can hear commands.',
  cooldown: 5,
  execute(interaction, client) {
    let days = Math.floor(interaction.client.uptime / 86400000);
    let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
    let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
    let seconds = Math.floor(interaction.client.uptime / 1000) % 60;

    let embed = new MessageEmbed()
      .setColor('#ffffff')
      .setTitle(`${client.user.tag} is online!`)
      .setURL(config.bot.website)
      .setImage(config.bot.avatar)
      .setDescription(`Thanks for checking if ${config.bot.name} was online. ${config.bot.name} has been awake for \`${days}d ${hours}h ${minutes}m ${seconds}s\`!\nMy prefix is \`${config.bot.prefix}\`\nI am the official bot of the [CodingHelp](${config.bot.website}) Discord Server! If you want to see all of my commands run \`${config.bot.prefix}help\` or [check here](${config.bot.website}/commands/).\nIf you want to know exactly how I am coded, you can see all of my pieces parts on my [GitHub Repo](${config.bot.github}).\n\nYou can find CodingHelp at these locations:\n[Reddit](${config.bot.website}/reddit)\n[Discord](${config.bot.website}/discord)\n[Website](${config.bot.website})\n\nIf you have found an issue with the bot, please run \`${config.bot.prefix}report\` to report the issue!`)
      .setTimestamp()
      .setFooter(`Thanks for using ${config.bot.name}!`, config.bot.avatar)

    interaction.editReply({ embeds: [embed], ephemeral: true });
  }
};