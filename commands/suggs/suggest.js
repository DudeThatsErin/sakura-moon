const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'suggestions',
    aliases: ['suggest', 'suggestion', 'sugg', 's'],
    description: 'Creates a suggestion!',
    note: '',
    usage: 's.suggestions [suggestion here]',
    example: 's.suggestions I want pudding!',
    inHelp: 'yes',
    permissions: '',
    patreonOnly: 'no',
    async execute(message, args) {

        const channel = message.guild.channels.cache.find(c => c.name === 'suggestions');
        if (!channel) {
            message.guild.channels.create('suggestions', {
                type: 'text',
                reason: 'Sakura Moon needed a suggestions channel for the suggestions handler.'
            }).then((channel) => {
                message.channel.send('The suggestions channel did not exist so I created one!')
            }).catch(console.error);

            let messageArgs = '';
            if (args.length > 0) {
                messageArgs = args.join(' ');
            } else {
                message.reply('You need to specify a suggestion to use this command. How will we know what you want to suggest unless you tell us?! If you would like to check the status of your suggestion then you can use \`++statussug [your status message ID]\`.');
                return;
            }
            let newStatus = 'New Suggestion';
            let author = message.author.id || 'default value';
            let name = message.author.tag;
            let avatar = message.author.displayAvatarURL({
                dynamic: true
            });

            const initial = new Discord.MessageEmbed()
                .setColor('#FADF2E')
                .setAuthor(`${name}`, `${avatar}`)
                .setDescription(messageArgs)
                .setFooter('📈 This suggestion currently needs votes and feedback. If you would like to discuss it, please visit #discussions and discuss it there.');

            const msg = await channel.send(initial);
            msg.react('👍');
            msg.react('👎');
            message.delete();
            const suggNo = msg.id;

            let embed = new Discord.MessageEmbed()
                .setColor('#CECC41')
                .setTitle(`Hey, ${message.author.username}! Thanks for submitting a suggestion to ${message.guild.name}`)
                .setDescription(`Your suggestion was as follows:\n\`\`\`${messageArgs}\`\`\`\nOur server needs to have time to vote on this. Once some time has passed, you can check the suggestion channel to check the updated status of your suggestion or use \`s.statussugg [your status message ID]\` and that message ID is \`${suggNo}\`. So, to check the status of your message you can copy and paste this into the channel where you use bot commands: \`\`\`s.statussugg ${suggNo}\`\`\``)

            message.client.users.cache.get(`${author}`).send(embed);

            try {
                (await connection).query(
                    `INSERT INTO Suggs (noSugg, Author, Message, Avatar, stat) VALUES(?, ?, ?, ?, ?)`,
                    [suggNo, author, messageArgs, avatar, newStatus]
                );

            } catch (err) {
                console.log(err);
            }
        } else {
            let messageArgs = '';
            if (args.length > 0) {
                messageArgs = args.join(' ');
            } else {
                message.reply('You need to specify a suggestion to use this command. How will we know what you want to suggest unless you tell us?!\nIf you would like to check the status of your suggestion then you can use \`s.statussugg [your status message ID]\`.');
                return;
            }
            let newStatus = 'New Suggestion';
            let author = message.author.id || 'default value';
            let name = message.author.tag;
            let avatar = message.author.displayAvatarURL({
                dynamic: true
            });

            const initial = new Discord.MessageEmbed()
                .setColor('#FADF2E')
                .setAuthor(`${name}`, `${avatar}`)
                .setDescription(messageArgs)
                .setFooter('📈 This suggestion currently needs votes and feedback. If you would like to discuss it, please visit #discussions and discuss it there.');



            const msg = await channel.send(initial);
            msg.react('👍');
            msg.react('👎');
            message.delete();
            const suggNo = msg.id;

            let embed = new Discord.MessageEmbed()
                .setColor('#CECC41')
                .setTitle(`Hey, ${message.author.username}! Thanks for submitting a suggestion to ${message.guild.name}`)
                .setDescription(`Your suggestion was as follows:\n\`\`\`${messageArgs}\`\`\`\nOur server needs to have time to vote on this. Once some time has passed, you can check the suggestion channel to check the updated status of your suggestion or use \`s.statussug [your status message ID]\` and that message ID is \`${suggNo}\`. So, to check the status of your message you can copy and paste this into the channel where you use bot commands: \`\`\`s.statussugg ${suggNo}\`\`\``)

            message.client.users.cache.get(`${author}`).send(embed);

            try {
                (await connection).query(
                    `INSERT INTO Suggs (noSugg, Author, Message, Avatar, stat) VALUES(?, ?, ?, ?, ?)`,
                    [suggNo, author, messageArgs, avatar, newStatus]
                );

            } catch (err) {
                console.log(err);
            }
        }


    }
}