// at the top of your file
const Discord = require('discord.js');
const ee = require('../../config/embed.json');

module.exports = {
    name: 'partners',
    description: 'Displays all the information on the #announcements channel.\n**Note:** Only the Mod Team can run this command.',
    aliases: ['affies', 'affiliates', 'partner'],
    usage: '++partners',
    modOnly: 'yes',
    ownerOnly: 'no',
    execute(message, args) {

        const aboutPartner = new Discord.MessageEmbed()
            .setColor(ee.rand_color)
            .setTitle('What is a Discord Partner?')
            .setDescription('That is someone that has partnered with our server as they believe in it as much as the staff team does.')
            .addFields(
                { name: 'How do I become a Discord Partner?', value: 'All you need to do is message the mods and ask. To message the mods you will want to use our Modmail bot: <@575252669443211264> Be sure to include the invite link to your server.\nAlternatively, you can [visit our website](https://codinghelp.site/partner-app/) to fill out our application and we will get back to you.\nNote: Small servers will not be accepted. Your server will need to be established with at least 1,500 members. This doesn\'t mean you will be accepted with that minimum, just that we will consider you with at least that many members.' },
            )

        const smartWatch = new Discord.MessageEmbed()
            .setColor(ee.rand_color)
            .setTitle('Smart Watch')
            .setImage('https://media.discordapp.net/attachments/792764567649517582/793749473959346186/Banner.png')
            .setDescription('The server for the intellectual watch wearer. Smartwatch is a place to talk with other watch wearers and get help on making your smartwatch part of your daily life, with Support teams for the major wearable brands. We offer community & brand events, as well as up to date news about your favorite brands.')
            .addFields(
                { name: 'Representative', value: '<@521656100924293141>', inline: true },
                { name: '♾️Link', value: 'https://discord.gg/nPEHdsyjDg', inline: true },
            )

        const alphaBet = new Discord.MessageEmbed()
            .setColor(ee.rand_color)
            .setTitle('AlphaBet')
            .setImage('https://images-ext-2.discordapp.net/external/VK5lVCOz1EndZMQ1Lf_uOLlBHeOUjT2k5wh1B6hlbaE/https/media.discordapp.net/attachments/746035174160203789/786949644285509642/alphabet_logo_small.png')
            .setDescription('Welcome to AlphaBet Community. AlphaBet is a coding community for learning programming, like- Python, Java, C, C++, C#, Go, Rust, Haskell, Lisp, Rust, Scala, Clojure, Swift, Kotlin, Web-Development, JavaScript, Typescript, Ruby, Crystal, Lua, PHP, SQL-Database ....\n:bookmark: Daily coding tasks for members regularly.\n:bookmark: Exclusive Polling Contest with our bot.\n:bookmark: For Job Hunters: Interview questions & discussion.\n:bookmark: Different coding events, competitions and group projects.\n:bookmark: We are active 24/7.')
            .addFields(
                { name: 'Representative', value: '<@561178341978144799>', inline: true },
                { name: '♾️Link', value: 'https://discord.gg/PCkrwRXQJ9', inline: true }
            );

        const tca = new Discord.MessageEmbed()
            .setColor(ee.rand_color)
            .setTitle('The Coding Academy')
            .setDescription('**Wanna learn how to make your own Discord Bot?**🤖\n🔗 We are a community of coders that will help you to make Discord Bots.\n\n**We also have experienced coders**\n🔗 We can help you if you have doubts!\n\nWe have:-\n🏕️  **Level 2** Server Boost!\n🙇  **4000+** Members!\n💻 **Experienced** Coders!\n🎉 **Nitro** Giveaways \n🥇 **Fun Events** eg. Hunger Games\n\nCome on! What are you waiting for? Join the community and have fun with everyone! ')
            .addFields(
                { name: 'Representative', value: '<@698225613617496094>', inline: true },
                { name: '♾️Link', value: 'https://discord.gg/fT9V379aAc', inline: true }
            );


        message.channel.bulkDelete(1);
        message.channel.send({ embeds: [aboutPartner, smartWatch, alphaBet, tca] });

    },

};