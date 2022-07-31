const { MessageActionRow, MessageButton } = require('discord.js');
const rulesLink = 'https://codinghelp.site/Rules-for-Participating-on-r-CodingHelp-cb011ca7106148af9fb9ba64b295c969';
const config = require('../../config/config.json');
const color = 0x1a1a1a;
//Rule Embeds
const rule1 = {
  color: color,
  title: 'Rule 1',
  url: rulesLink,
  thumbnail: {
    url: 'https://imgur.com/U6cwQxj.png'
  },
  description: `No spam, advertising, or NSFW content. Be Nice & Use common sense. If you are found to post spam or advertise you will be [warned or banned as stated here](${rulesLink})`
}

const rule2 = {
  color: color,
  title: 'Rule 2',
  url: rulesLink,
  thumbnail: {
    url: 'https://imgur.com/U6cwQxj.png'
  },
  description: `Don\’t ask if you can ask a question, just ask it! If someone knows the answer, they\’ll do their best to help. \n\nIf you are found to be asking if you can ask a question or if anyone is available several times after being reminded each time, you will be warned or banned.`
}

const rule3 = {
  color: color,
  title: 'Rule 3',
  thumbnail: {
    url: 'https://imgur.com/U6cwQxj.png'
  },
  url: rulesLink,
  description: `If you need help with a problem in your code, always provide the raw code in GitHub gist or a similar place. If you aren’t sure what places, you can check [this article](${rulesLink}).`
}

const rule4 = {
  color: color,
  title: 'Rule 4',
  url: rulesLink,
  thumbnail: {
    url: 'https://imgur.com/U6cwQxj.png'
  },
  description: `Do not message the mods directly for any reason. If you are wanting to message the mods, please use the Modmail bot. If you are messaging the mods directly, your messages will be ignored. If you are continually messaging the mods, you will be warned or banned.`
}

const rule5 = {
  color: color,
  title: 'Rule 5',
  url: rulesLink,
  thumbnail: {
    url: 'https://imgur.com/U6cwQxj.png'
  },
  description: `Do not ask our members personal questions like gender, age, sexual preference, etc. This is not a dating server, nor is it a place where those questions matter. They mean nothing when it comes to whether or not someone can code. If someone decides to share anything, they can do so using their own free will. Explicitly asking these questions will get you warned, muted, or banned depending on the circumstances. **NO EXCEPTIONS.**`
}

const rule6 = {
  color: color,
  title: 'Rule 6',
  url: rulesLink,
  thumbnail: {
    url: 'https://imgur.com/U6cwQxj.png'
  },
  description: 'We are not going to spoon feed you answers. Meaning we will not tell you exactly how to get from point A to point C without you already knowing how to do points A, B & C. Will can give you some tips on how to get from point A to point C but we will not spoon feed you the answers. [Spoon feeding will not help you learn, it will only be harmful to your learning](https://smiletutor.sg/how-spoon-feeding-is-harmful-to-learning/). If you are new to something, please learn the basics before asking for help with something more advanced. If you are not new and we are saying that we are spoon feeding you, then you may need to go back and re-learn the basics.'
}

const rule7 = {
  color: color,
  title: 'Rule 7',
  url: rulesLink,
  thumbnail: {
    url: 'https://imgur.com/U6cwQxj.png'
  },
  description: 'Do not send mass DMs to users. If you are caught DMing a massive number of people (determined by our mods) at a time, you will be permanently banned (perma-banned) from our server. We will not warn you, we will not discuss it. We do not put up with that. Please only DM users that have the **DMs Open** role.'
}

const rule8 = {
  color: color,
  title: 'Rule 8',
  url: rulesLink,
  thumbnail: {
    url: 'https://imgur.com/U6cwQxj.png'
  },
  description: 'Please wait 1 hour before pinging any of the language roles. You can avoid this hour wait by becoming one of our Server Boosters. You also get additional benefits detailed below. This is to avoid useless and unneeded pinging of our users.'
}

// Actual Rule Command
module.exports = {
  name: "rules",
  description: "Asks users to make sure they are following the rules. This deletes your message pinging the bot and the one right under that.",
  aliases: ['follow', 'pls', 'rule'],
  usage: `${config.prefix}rules @username or user ID rule number[1-5] or ${config.prefix}rules @username or ID all`,
  example: `${config.prefix}rules @DudeThatsErin#8736 4 or ${config.prefix}rules @DudeThatsErin#8736 all`,
  modOnly: 1,
  execute(message, args) {
    const rules = [rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8]; // Keeps all of the rules inside an array.

    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel('All our Rules')
          .setStyle('LINK')
          .setURL(rulesLink),
        new MessageButton()
          .setLabel('Our Knowledgebase')
          .setStyle('LINK')
          .setURL('https://codinghelp.site')

      );

    if (message.reference === null) { // just a regular message

      const user = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
      if (!user) return message.channel.send({ content: 'You need to specify a user via mention or the ID.' }); // if a user isn't mentioned.

      if (args[0] === 'all') { // Displays all of the rules when ++rules all is run.
        user.send({ content: 'These are all of our server\'s rules:' });
        for (let i = 0; i < rules.length; i++) {
          user.send({ embeds: [rules[i]], components: [buttons] });
        }
      }

      else {
        const nb = parseInt(args[0])
        if (nb < 1 || nb > rules.length || isNaN(nb)) { // Gives an error if a correct rule number isn't specified.
          message.reply({ content: "Please enter a valid rule number. If you aren't sure what is a valid rule number, please check: https://codinghelp.site/" });
          return;
        };
        let usr = message.mentions.members.first();

        usr.send({ content: `${usr}, Please follow the rules: \n`, embeds: [rules[nb - 1]], components: [buttons] }); // DMs the user.
      }

      message.reply({ content: `📨 Hey, ${user} I just sent you a DM about our rules! Please check it!` });
    }
    else { // if new message reply

      //console.log(args[0]); // logs correctly... why doesn't it work?

      const user = message.mentions.repliedUser.id;
      if (!user) return message.channel.send('You need to specify a user via mention or the ID.'); // if a user isn't mentioned.

      if (args[0] === 'all') { // Displays all of the rules when ++rules all is run.
        const usr = message.mentions.repliedUser;
        usr.send({ content: 'These are all of our server\'s rules:' });
        for (let i = 0; i < rules.length; i++) {
          usr.send({ embeds: [rules[i]], components: [buttons] });
        }
      }

      else {
        const nb = parseInt(args[0])
        if (nb < 1 || nb > rules.length || isNaN(nb)) { // Gives an error if a correct rule number isn't specified.
          message.reply({ content: "Please enter a valid rule number. If you aren't sure what is a valid rule number, please check: https://codinghelp.site/" });
          return;
        };
        const usr = message.mentions.repliedUser;
        usr.send({ content: `Hello ${usr.username}, Please follow the rules: \n`, embeds: [rules[nb - 1]], components: [buttons] }); // DMs the user.
      }

      const usr = message.mentions.repliedUser;

      message.reply({ content: `📨 Hey, ${usr.username} I just sent you a DM about our rules! Please check it!` });
    }
  }
}