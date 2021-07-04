module.exports = {
  name: 'ping',
  description: 'Makes sure the bot can hear commands.',
  aliases: ['uptime', 'beep', 'boop', 'alive'],
  usage: 's.ping',
  example: 's.ping or s.beep or s.uptime',
  inHelp: 'yes',
  userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
  botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
  execute(message, args) {
    let days = Math.floor(message.client.uptime / 86400000);
    let hours = Math.floor(message.client.uptime / 3600000) % 24;
    let minutes = Math.floor(message.client.uptime / 60000) % 60;
    let seconds = Math.floor(message.client.uptime / 1000) % 60;

    message.channel.send(`🏓 Pong! I have been awake for ${days}d ${hours}h ${minutes}m ${seconds}s`);
  }
};