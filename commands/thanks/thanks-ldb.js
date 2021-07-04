const Discord = require('discord.js');
const connection = require('../../database.js');


module.exports = {
    name: 'thanks-leaderboard',
    description: 'This gives users the ability to see the top 10 users on the leaderboard and also their position on the leaderboard.',
    aliases: ['tks-ldbd', 'thx-leaderboard', 'tleaderboard', 'thanksleaderboard', 'txlbd', 'txldb', 'thnxldb', 'thxldb'],
    usage: 's.thanks-leaderboard',
    example: 's.thanks-leaderboard or s.thxldb or s.txlbd',
    cooldown: 5,
    inHelp: 'yes',
    note: '',
    permissions: '',
    patreonOnly: 'no',
    async execute(message, args, client) {

        let guild = message.guild.id;
        let author = message.author.id;
        let aUsername = message.author.username;

        let userNames = '';
        let points = '';


        const results = await (await connection).query(
            `SELECT * FROM Thanks WHERE userId = ? AND guildId = ?;`,
            [author, guild]
        );

        const top10 = await (await connection).query(
            `SELECT userId, SUM(CAST(thanks AS UNSIGNED)) AS total FROM Thanks WHERE guildId = ? GROUP BY userId ORDER BY total DESC LIMIT 10;`,
            [guild]
        );

        for (let i = 0; i < top10[0].length; i++) {
            const data = top10[0];
            const user = data[i].userId;
            let membr = await client.users.cache.get(user);
            let username = membr.username;

            userNames += `${i + 1}. ${username}\n`;
            points += `${data[i].total}\n`;

        }


        if (top10 === undefined || top10[0] === undefined || top10[0][0] === undefined) {
            message.channel.send('No one is on the leaderboard yet.');
        } else if (results === undefined || results[0] === undefined || results[0][0] === undefined) {


            let embed2 = new Discord.MessageEmbed()
                .setTitle('This is the current thanks leaderboard.')
                .setColor('#AD66A0')
                .addFields({
                    name: `Top 10`,
                    value: userNames,
                    inline: true
                }, {
                    name: 'Thanks',
                    value: points,
                    inline: true
                }, {
                    name: 'How many thanks do you have?',
                    value: `${aUsername}, you currently have \`0\` thank(s).`
                })
                .setFooter('If there is an error here, please report this!');

            message.channel.send(embed2);

        } else {
            const ponts = await (await connection).query(
                `SELECT thanks, SUM(CAST(thanks AS UNSIGNED)) AS total FROM Thanks WHERE guildId = ? AND userId = ?;`,
                [guild, author]
            );
            const p = ponts[0][0].total;
            let embed2 = new Discord.MessageEmbed()
                .setTitle('This is the current thanks leaderboard.')
                .setColor('#c9ca66')
                .addFields({
                    name: `Top 10`,
                    value: userNames,
                    inline: true
                }, {
                    name: 'Thanks',
                    value: points,
                    inline: true
                }, {
                    name: 'How many thanks do you have?',
                    value: `${aUsername}, you currently have \`${p}\` thank(s).`
                })
                .setFooter('If there is an error here, please report this!');

            message.channel.send(embed2);
        }
    }
}