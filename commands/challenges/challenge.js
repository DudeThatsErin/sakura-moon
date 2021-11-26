const Discord = require('discord.js');
const connection = require('../../database.js');
const embd = require('../../config/embed.json');

module.exports = {
    name: 'challenge',
    description: 'This command allows **mods** to add additional challenge questions to the Challenge System.',
    aliases: ['new-challenge', 'chall', 'c'],
    usage: 's.challenge [challenge number] [question]',
    inHelp: 'yes',
    timeout: 45000000,
    chlMods: 1,
    example: 's.challenge 1 What is my favorite color?',
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_ROLES', 'MANAGE_NICKNAMES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
    async execute (message, args, client) {

        let msgId = message.id;
        let guildId = message.guild.id;
        let challengeNo = args[0];
        let answer = args.slice(1).join(' ');
        let moderator = message.author.id;

        const result = await connection.query(
            `SELECT * FROM Challenge WHERE guildId = ?;`,
            [guildId]
        );
        //console.log(result[0][0].channelD)
        const announcementsChannel = result[0][0].channelD;
        if (!result) return message.channel.send('The challenge has not started yet. Please start the challenge first before running this.');
        const participants = result[0][0].partRoleiD;

        if (!challengeNo) {
                const challenge = await connection.query(
                    `SELECT * FROM ChallengeQ WHERE guildId = ? ORDER BY challengeNo DESC LIMIT 1;`,
                    [guildId]
                );
            const challengeNo = challenge[0][0].challengeNo || '\`0 zilch nada, there isn\'t a challenge in the database.\`';
            message.react('❓');
                message.reply(`What challenge number are you trying to add to the database? The last challenge number in the database is ${challengeNo}.`);
                return;
        } else {
            if (!answer) {
                message.react('❓');
                message.reply('What is the challenge that you want to submit? You can\'t submit a blank challenge.');
                return;
            } else {
                let ch = client.channels.cache.get(announcementsChannel) || await client.channels.fetch(announcementsChannel).catch(console.log(err))

                let embeD = new Discord.MessageEmbed()
                    .setColor(embd.newchQ)
                    .setTitle(`Challenge ${challengeNo}`)
                    .setDescription(`${answer}`)
                    .setFooter('Run the s.submit command to submit answers to this challenge.');


                ch.send({ content: `Hey, <@&${participants}> A new challenge is up!`, embeds: [embeD] }).then(message => {
                    console.log(message);
                    console.log(message.id);
                    const msg = message.id;
                    connection.query(
                        `INSERT INTO ChallengeQ (msgId, guildId, title, challengeNo, moderator) VALUES (?, ?, ?, ?, ?);`,
                        [msg, guildId, answer, challengeNo, moderator]
                    );
                }
                );
                const results = await connection.query(
                    `SELECT * FROM ChallengeQ WHERE guildId = ? AND challengeNo = ?;`,
                    [guildId, challengeNo]
                );
                const res = results[0][0];
                const mes = res.msgId;
                let embed = new Discord.MessageEmbed()
                    .setColor('#92caa0')
                    .setTitle(`I have added Challenge number ${challengeNo} to the \`Challenge\` Database.`)                        
                    .setDescription(`The submission is as follows: ${answer} You can see it here: <#${announcementsChannel}>.\n\nThe message ID for the challenge is: \`${mes}\``)
                    .setFooter('If this is in error, please report this!');

                message.channel.send({ embeds: [embed] })
                message.delete();
                }
            }


    }
}