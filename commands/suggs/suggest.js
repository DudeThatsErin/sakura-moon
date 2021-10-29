const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'suggestions',
    aliases: ['suggest', 'suggestion', 'sugg', 's'],
    description: 'Creates a suggestion!',
    usage: '++suggestions [suggestion here]',
    example: '++suggestions I want pudding!',
    inHelp: 'yes',
    userPerms: [''],
    async execute(message, args){

    const channel = message.guild.channels.cache.find(c => c.name === 'suggestions');
    if(!channel) {
        message.guild.channels.create('suggestions', {
            type: 'text',
            reason: 'CodingHelp Bot needed a suggestions channel for the suggestions handler.'
        }).then((channel) => {
            message.channel.send('The suggestions channel did not exist so I created one!')
        }).catch(console.error);

        let messageArgs = '';
        if (args.length > 0) {
            messageArgs = args.join(' ');
        } else {
            message.react('❓');
            message.reply('You need to specify a suggestion to use this command. How will we know what you want to suggest unless you tell us?! If you would like to check the status of your suggestion then you can use \`++statussug [your status message ID]\`.');
            return;
        }
        let newStatus = 'New Suggestion';
        let author = message.author.id || 'default value';
        let name = message.author.tag;
        let avatar = message.author.displayAvatarURL({ dynamic: true});
    
        const initial = new Discord.MessageEmbed()
        .setColor('FADF2E')
        .setAuthor(`${name}`, `${avatar}`)
        .setDescription(messageArgs)
        .setFooter('📈 This suggestion currently needs votes and feedback. If you would like to discuss it, please visit #discussions and discuss it there.');
    
        message.client.users.cache.get(`${author}`).send(`Hey, ${message.author.username}! Thanks for submitting a suggestion! Our server needs to have time to vote on this. Once some time has passed, you can check the suggestion channel to check the updated status of your suggestion! We appreciate your feedback! Happy chatting!`);
    
        const msg = await channel.send(initial);
            msg.react('👍');
            msg.react('👎');
            message.delete();
        const suggNo = msg.id;
    
        try {
            (await connection).query(
                `INSERT INTO Suggs (noSugg, Author, Message, Avatar, stat) VALUES(?, ?, ?, ?, ?)`,
                [suggNo, author, messageArgs, avatar, newStatus]
            );
    
        } catch(err) {
            console.log(err);
        }
    } else {
        let messageArgs = '';
        if (args.length > 0) {
            messageArgs = args.join(' ');
        } else {
            message.react('❓');
            message.reply('You need to specify a suggestion to use this command. How will we know what you want to suggest unless you tell us?! If you would like to check the status of your suggestion then you can use \`++statussug [your status message ID]\`.');
            return;
        }
        let newStatus = 'New Suggestion';
        let author = message.author.id || 'default value';
        let name = message.author.tag;
        let avatar = message.author.displayAvatarURL({ dynamic: true});
    
        const initial = new Discord.MessageEmbed()
        .setColor('FADF2E')
        .setAuthor(`${name}`, `${avatar}`)
        .setDescription(messageArgs)
        .setFooter('📈 This suggestion currently needs votes and feedback. If you would like to discuss it, please visit #discussions and discuss it there.');
    
        message.client.users.cache.get(`${author}`).send(`Hey, ${message.author.username}! Thanks for submitting a suggestion! Our server needs to have time to vote on this. Once some time has passed, you can check the suggestion channel to check the updated status of your suggestion! We appreciate your feedback! Happy chatting!`);
    
        const msg = await channel.send({ embeds: [initial] });
            msg.react('👍');
            msg.react('👎');
            message.delete();
        const suggNo = msg.id;
    
        try {
            (await connection).query(
                `INSERT INTO Suggs (noSugg, Author, Message, Avatar, stat) VALUES(?, ?, ?, ?, ?)`,
                [suggNo, author, messageArgs, avatar, newStatus]
            );
    
        } catch(err) {
            console.log(err);
        }
    }


    }
}