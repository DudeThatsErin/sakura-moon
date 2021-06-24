const Discord = require('discord.js');
const connection = require('../../database.js');

module.exports = {
    name: 'challenge',
    description: 'This command allows **mods** to add additional challenge questions to the Challenge System.',
    aliases: ['new-challenge', 'chall', 'c'],
    usage: 's.challenge [challenge number] [question]',
    inHelp: 'yes',
    example: 's.challenge 1 What is my favorite color?',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    note: 'In order for mods to use this command, someone from the Guild needs to support Sakura Moon on [Patreon](https://www.patreon.com/SakuraMoon) and they need to have one of the following permissions:\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`.',
    async execute (message, args) {

      const results = await connection.query(
        `SELECT * from Patrons WHERE guildId = ?;`,
        [message.guild.id]
    );
      if(results[0][0] === undefined || results[0][0] === 'undefined') return message.reply('Only patrons have access to use the Challenge System. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');        let role = ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'];
        if(!message.member.guild.me.hasPermission([`${role}`])){ 
            message.channel.send('You do not have permission to run this command. Only users with one of the following permissions can run this command:\n\`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`');
            return;
        } else {
        let msgId = message.id;
        let guildId = message.guild.id;
        let challengeNo = args[0];
        let answer = args.slice(1).join(' ');
        let moderator = message.author.id;

        const result = await (await connection).query(
            `SELECT * FROM Challenge WHERE guildId = ?;`,
            [guildId]
        );
        const announcementsChannel = result[0][0].channelD;


        if (!challengeNo) {
                const challenge = await (await connection).query(
                    `SELECT * FROM Challenge WHERE guildId = ? ORDER BY challengeNo DESC LIMIT 1;`,
                    [guildId]
                );
                const challengeNo = challenge[0][0].challengeNo;
                message.reply(`What challenge number are you trying to add to the database? The last challenge number in the database is ${challengeNo}.`);
                return;
        } else {
            if(!answer) {
                message.reply('What is the challenge that you want to submit? You can\'t submit a blank challenge.');
                return;
            } else {

                let embeD = new Discord.MessageEmbed()
                    .setColor('BLUE')
                    .setTitle(`Challenge ${challengeNo}`)
                    .setDescription(`${answer}`)
                    .setFooter('Run the s.submit command to submit answers to this challenge.');


                    let role = message.guild.roles.cache.find(r => r.name === "Participants");
                const message2 = await message.guild.channels.cache.get(announcementsChannel).send(`Hey, ${role} A new challenge is up!`, embeD)

                    const msg = message2.id;
                    console.log(msg);
                    await (await connection).query(
                        `INSERT INTO Challenge (guildId, msgId, moderator, title, challengeNo) VALUES (?, ?, ?, ?, ?)`,
                        [guildId, msg, moderator, answer, challengeNo]
                    );
                    console.log('added to db');
                const results = await (await connection).query(
                    `SELECT * FROM Challenge WHERE guildId = ? AND challengeNo = ?;`,
                    [guildId, challengeNo]
                );
                const res = results[0][0];
                const mes = res.msgId;
                let embed = new Discord.MessageEmbed()
                    .setColor('#92caa0')
                    .setTitle(`I have added Challenge number ${challengeNo} to the \`Challenge\` Database.`)                        
                    .setDescription(`The submission is as follows: ${answer} You can see it here: <#${announcementsChannel}>.\n\nThe message ID for the challenge is: \`${mes}\``)
                    .setFooter('If this is in error, please report this!');

            message.channel.send(embed)
                message.delete();
                }
            }


        }

    }
}
