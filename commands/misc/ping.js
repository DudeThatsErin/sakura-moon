const config = require('../../config/config.json');
const owner = require('../../config/dev.json');

module.exports = {
    name: 'ping',
    description: 'Makes sure the bot can hear commands.',
    aliases: ['pong', 'beep', 'online', 'bot', 'hello', 'hi'],
    example: `${config.prefix}ping or ${config.prefix}hi`,
    cooldown: 5,
    execute(message) {
        let days = Math.floor(message.client.uptime / 86400000);
        let hours = Math.floor(message.client.uptime / 3600000) % 24;
        let minutes = Math.floor(message.client.uptime / 60000) % 60;
        let seconds = Math.floor(message.client.uptime / 1000) % 60;

        let embed = {
          color: 0xffffff,
          title: `${config.name} is online!`,
          url: config.url,
          thumbnail: {
            url: config.avatar
          },
          description:`Thanks for checking if ${config.name} was online. ${config.name} has been awake for \`${days}d ${hours}h ${minutes}m ${seconds}s\`! That is the last time ${owner.name} reset ${config.name}. You can see the uptime of my website [here](${config.uptime})!\nMy prefix is \`${config.prefix}\`\nIf you want to see all of my commands run \`/help\` or [check here](${config.commandsURL}).\nIf you want to know exactly how I am coded, you can see all of my pieces parts on my [GitHub Repo](${config.github}).\n\nIf you have found an issue with the bot, please run \`${config.prefix}report\` to report the issue!`,
          timestamp: new Date(),
          footer: {
            text: `Thanks for using ${config.name}!`,
            icon_url: config.avatar
          }
        }

        message.reply({ embeds: [embed] });
    }
};