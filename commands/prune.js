const Discord = require("discord.js");

module.exports = {
    name: 'prune', 
    description: 'Delete up to 99 messages. Only users with the `MANAGE_MESSAGES` role will be able to use this command.',
    aliases: ['delete', 'goaway'],
    usage: '++prune [number 2-99]',
    example: '++prune 49',
    inHelp: 'yes',
    execute(message, args) {

        const amount = parseInt(args[0]);
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!user === message.member.hasPermission("MANAGE_MESSAGES") || !message.member.roles.cache.has('718253309101867008')) {
            if (isNaN(amount)) {
                return message.reply('Oops! That doesn\'t seem to be a valid number.');
            }
            else if (amount <= 1 || amount > 100) {
                return message.reply('Please enter a valid number between 2 and 99.');
            } 

            if( message.channel.bulkDelete(amount, true)/*.then(deletedMessages => {
                //filter the deleted messages with .filter()
                var botMessages = deletedMessages.filter(m => m.author.bot);
                var userPins = deletedMessages.filter(m => m.pinned);
                var userMessages = deletedMessages.filter(m => !m.author.bot);

                const deletEmbed = new Discord.MessageEmbed()
                    .setColor('	#00FF00')
                    .setTitle("Success! :thumbsup:")
                    .setFooter("r/CodingHelp Bot")
                    .setTimestamp()
                    .addField("Bot Messages Purged", botMessages.size, false)
                    .addField("User Pins Purged", userPins.size, false)
                    .addField("User Messages Purged", userMessages.size, false)
                    .addField("Total Messages Purged", deletedMessages.size, false);

                message.channel.send(deletEmbed);
            })
                .catch(err => {
                    console.error(err);
                    message.channel.send('Whoops! There was an error trying to prune messages in this channel! Check the command and try again.');
                })*/
            );
        }
        else {
            message.reply("❌ You don't have the correct permissions to prune messages. You need the `MANAGE_MESSAGES` permission.");
        }
    }
};