const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'start-challenge',
    description: 'This gives **mods** the ability to start a challenge by storing the prizes for 1st, 2nd and 3rd place as well as the announcements channel ID.',
    aliases: ['sc', 'start', 'startchallenge', 'startc', 'startchall'],
    usage: '++start-challenge [announcements channel ID] [prize 1|prize 2|prize 3]',
    example: '++start-challenge 841366694948765786 Nitro|Nitro Classic|Special Role',
    inHelp: 'yes',
    userPerms: [''],
    botPerms: [''],
    modOnly: 'yes',
    async execute (message, args) {
        let announcementsChannel = args[0];
        let guild = message.guild.id;
        let mod = message.author.id;
        let prize = [];
        let prizes = args.slice(1).join(' ').split("|");
        let role = message.member.roles.cache.has('839863262026924083') || !message.member.roles.cache.has('718253309101867008');
        if(role) {
            message.channel.send('You do not have permission to run this command. Only moderators can run this command!');
            return;
        } else {
            if (!announcementsChannel) {
                message.reply('You need to include the ID of the channel where you want me to post the Challenge Questions!');
                return;
            }  else {
                if(!prizes) {
                    message.reply('What prizes did you want to the top 3 users to get? You will need to post it like this: \`prize 1|prize 2|prize 3\`. If you don\'t understand, you can ask for explanation from Erin.');
                    return;
                } else {
                            prizes.forEach(prize => {
                                prizes.push(prize);
                            });
                            const rules = new Discord.MessageEmbed()
                                .setColor('GREEN')
                                .setTitle(`Our Challenge has started!`)
                                .setDescription('If you would like to participate, please check out the <#703989632110690324> channel to get the \`Participants\` role. Please read our rules, they explain how to use our challenge system!')
                                .addFields(
                                    {name: 'Commands', value: 'These are the commands you can use with our system.\n\`++submit [challenge number] [answer]\` - This is how you submit answers to our challenges.\n\`++leaderboard\` - This is how you check the leaderboard for the challenge. It displays the top 10 users.\n\`++edit-submission\` - This is how you edit your submission for the challenge. You can only edit it until it has been reviewed. Once a submission has been reviewed, you may not edit it.'},
                                    {name: 'Rules', value: '1. Please be courteous to our fellow participants. Being rude, degrading, etc. will get you disqualified from the challenge.\n2. Please only submit once to each challenge. Multiple submissions can and will cause issues.'},
                                    {name: 'Prizes', value: `🥇 First Place: ${prizes[0]}\n🥈 Second Place: ${prizes[1]}\n🥉 Third Place: ${prizes[2]}`}
                                )
                                .setFooter('Thanks for participating in our challenge! Good luck!');
                    message.guild.channels.cache.get(announcementsChannel).send({ embeds: [rules] });
                        
                        const msg = message.id;
                            connection.query(
                                `INSERT INTO Challenge (guildId, msgId, channelD, moderator, prize1, prize2, prize3) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                                [guild, msg, announcementsChannel, mod, prizes[0], prizes[1], prizes[2]]
                            );
                      
                    message.react('👍');
                }
            }
        
        }

    }
}