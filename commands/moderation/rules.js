const config = require('../../config/config.json');
const Discord = require("discord.js");
const bot = require('../../config/bot.json')

//Rule Embeds
const rule1 = new Discord.MessageEmbed()
    .setColor('#1a1a1a')
    .setTitle('Rule 1')
    .setURL('https://codinghelp.site/wiki/knowledgebase/discord-server-rules/')
    .setThumbnail(bot.avatar)
    .setDescription('No spam, advertising, or NSFW content. Be Nice & Use common sense. If you are found to post spam or advertise you will be [warned or banned as stated here](https://codinghelp.site/knowledgebase/rules/warnings-bannings/).');

const rule2 = new Discord.MessageEmbed()
    .setColor('#1a1a1a')
    .setTitle('Rule 2')
    .setURL('https://codinghelp.site/knowledgebase/rules/discord-server-rules/')
    .setThumbnail(bot.avatar)
    .setDescription(`Don\’t ask if you can ask a question, just ask it! If someone knows the answer, they\’ll do their best to help.\n\nIf you are found to be asking if you can ask a question or if anyone is available several times after being reminded each time, you will be warned or banned.`);

const rule3 = new Discord.MessageEmbed()
    .setColor('#1a1a1a')
    .setTitle('Rule 3')
    .setURL('https://codinghelp.site/knowledgebase/rules/discord-server-rules/')
    .setThumbnail(bot.avatar)
    .setDescription(`If you need help with a problem in your code, always provide the raw code in GitHub gist or a similar place. If you aren’t sure what places, you can check [this article](https://codinghelp.site/knowledgebase/faq/share-code/).`);

const rule4 = new Discord.MessageEmbed()
    .setColor("#1a1a1a")
    .setTitle('Rule 4')
    .setURL('https://codinghelp.site/knowledgebase/rules/discord-server-rules/')
    .setThumbnail(bot.avatar)
    .setDescription(`Do not message the mods directly for any reason. If you are wanting to message the mods, please use the Modmail bot. If you are messaging the mods directly, your messages will be ignored. If you are continually messaging the mods, you will be warned or banned.`);

const rule5 = new Discord.MessageEmbed()
    .setColor("#1a1a1a")
    .setTitle('Rule 5')
    .setURL('https://codinghelp.site/knowledgebase/rules/discord-server-rules/')
    .setThumbnail(bot.avatar)
    .setDescription(`Do not ask our members personal questions like gender, age, sexual preference, etc. This is not a dating server, nor is it a place where those questions matter. They mean nothing when it comes to whether or not someone can code. If someone decides to share anything, they can do so using their own free will. Explicitly asking these questions will get you warned, muted, or banned depending on the circumstances. **NO EXCEPTIONS.**`);

const rule6 = new Discord.MessageEmbed()
    .setColor("#1a1a1a")
    .setTitle('Rule 6')
    .setURL('https://codinghelp.site/knowledgebase/rules/discord-server-rules/')
    .setThumbnail(bot.avatar)
    .setDescription(`We are not going to spoon feed you answers. Meaning we will not tell you exactly how to get from point A to point C without you already knowing how to do points A, B & C. Will can give you some tips on how to get from point A to point C but we will not spoon feed you the answers. [Spoon feeding will not help you learn, it will only be harmful to your learning.](https://smiletutor.sg/how-spoon-feeding-is-harmful-to-learning/) If you are new to something, please learn the basics before asking for help with something more advanced. If you are not new and we are saying that we are spoon feeding you, then you may need to go back and re-learn the basics.`);

const rule7 = new Discord.MessageEmbed()
    .setColor("#1a1a1a")
    .setTitle('Rule 7')
    .setURL('https://codinghelp.site/knowledgebase/rules/discord-server-rules/')
    .setThumbnail(bot.avatar)
    .setDescription(`Do not send mass DMs to users. If you are caught DMing a massive number of people (determined by our mods) at a time, you will be permanently banned (perma-banned) from our server. We will not warn you, we will not discuss it. We do not put up with that. Please only DM users that have the **DMs Open** role.`);

const rule8 = new Discord.MessageEmbed()
    .setColor("#1a1a1a")
    .setTitle('Rule 8')
    .setURL('https://codinghelp.site/knowledgebase/rules/discord-server-rules/')
    .setThumbnail(bot.avatar)
    .setDescription(`All error messages **must** be in English. This is the primary language of our server. We will *not* help if you post an error message in another language.`);

const rule9 = new Discord.MessageEmbed()
    .setColor("#1a1a1a")
    .setTitle('Rule 9')
    .setURL('https://codinghelp.site/knowledgebase/rules/discord-server-rules/')
    .setThumbnail(bot.avatar)
    .setDescription(`Please wait one hour before pinging a language role with your question. If you are found to be pinging language roles too frequently you will be muted in our server. We do not want to have to mute people. This is to prevent people from spam pinging our users.`);

// Actual Rule Command
module.exports = {
    name: "rules",
    description: "Sends a message to a user (or in a channel) asking a user to follow either all rules or a specific rule.",
    aliases: ['follow', 'pls'],
    usage: '++rules @username or user ID rule number[1-5] or ++rules all @username or ID',
    note: 'You can send a DM to a user or use \`-here\` to spit the message out in the channel you are in.',
    example: '++rules @DudeThatsErin#8061 all -here or ++rules @DudeThatsErin#8061 3',
    userPerms: ['MANAGE_MESSAGES'],
    modOnly: 'yes',
    ownerOnly: 'no',
    async execute(message, args) {
        const rules = []; // Keeps all of the rules inside an array.
        rules.push(rule1); // Pushes the rule1 embed. Each one below it pushes it's own embed. Each line is a separate rule and that is how the array knows 1 from 2 from 3, etc.
        rules.push(rule2);
        rules.push(rule3);
        rules.push(rule4);
        rules.push(rule5);
        rules.push(rule6);
        rules.push(rule7);
        rules.push(rule8);
        rules.push(rule9);

        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]); // args 1 aka ++rules [user]
        const allOrNumber = args[1];

        if (!user) { // no user specified
            message.react('❌');
            message.channel.send({ content: 'You didn\'t specify a user. Make sure to specify a user.' });
            return;
        }


        if (!allOrNumber) { // all nor number is not specified
            message.react('❌');
            message.channel.send({ content: 'You need to tell me which rule (or all rules) to send to the channel or user. Please use this format:\n\`++rules @username or ID [rule # or all]\`' });
            return;
        }

        if (message.content.endsWith('-here')) {
            if (allOrNumber === 'all') { // all specified
                await message.channel.send({ content: 'These are all of our server\'s rules.' });
                let text = '';
                for (let i = 0; i < rules.length; i++) {
                    message.channel.send({ embeds: [rules[i]] });
                }
                //await message.channel.send(text);
            }
            else { // not all
                const nb = parseInt(args[1]); // args 2 aka ++rules [user] [rule#]
                if (nb < 1 || nb > rules.length || isNaN(nb)) { // Gives an error if a correct rule number isn't specified.
                    message.react('❌');
                    message.channel.send({ content: "Please enter a valid rule number. If you aren't sure what is a valid rule number, please check: https://codinghelp.site/wiki/rules/discord-server-rules" });
                    return;
                }
                message.channel.send({ content: `${user}, Please follow the rules:\n`, embeds: [rules[nb - 1]] });
            }
        }
        else { // message content does not end with -here
            message.react('📨');
            if (allOrNumber === 'all') { // all specified
                await user.send({ content: 'These are all of our server\'s rules.' })
                let text = '';
                for (let i = 0; i < rules.length; i++) {
                    user.send({ embeds: [rules[i]] });
                }
                //await user.send(text);
            }
            else { // not all
                const nb = parseInt(args[1]); // args 2 aka ++rules [user] [rule#]
                if (nb < 1 || nb > rules.length || isNaN(nb)) { // Gives an error if a correct rule number isn't specified.
                    message.react('❌');
                    message.channel.send({ content: "Please enter a valid rule number. If you aren't sure what is a valid rule number, please check: https://codinghelp.site/wiki/rules/discord-server-rules" });
                    return;
                }
                user.send({ content: 'Please follow the rules:\n', embeds: [rules[nb - 1]] });
                message.channel.send({ content: `I just sent ${user} a message. Thanks ${message.author.username} for requesting this. ✅` });
            }
        }
    }
}