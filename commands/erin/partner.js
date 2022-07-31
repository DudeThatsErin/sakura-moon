// at the top of your file
const Discord = require('discord.js');
const ee = require('../../config/embed.json');
const config = require('../../config/config.json');

module.exports = {
    name: 'partners',
    description: 'Displays all the information on the #partners channel.',
    aliases: ['affies', 'affiliates', 'partner'],
    usage: `${config.prefix}partners`,
    modOnly: 1,
    execute(message) {

        const aboutPartner = new Discord.EmbedBuilder()
            .setColor(ee.light-green)
            .setTitle('What is a Discord Partner?')
            .setDescription('That is someone that has partnered with our server as they believe in it as much as the staff team does.')
            .addFields(
                { name: 'How do I become a Discord Partner?', value: 'All you need to do is message the mods and ask. To message the mods you will want to use our Modmail bot: <@575252669443211264> Be sure to include the invite link to your server.\nAlternatively, you can [visit Erin\'s website](https://dudethatserin.com) to fill out our application and we will get back to you.\nNote: Small servers will not be accepted. Your server will need to be established with at least 100 members. This doesn\'t mean you will be accepted with that minimum, just that we will consider you with at least that many members.' },
            )


        message.channel.bulkDelete(1);
        message.channel.send({ embeds: [aboutPartner] });

    },

};