const connection = require('../../database.js');
const Discord = require('discord.js');

module.exports = {
    name: 'test',
    description: 'This is a test command where I work on future commands that will be separated into other commands.',
    aliases: ['testcommand', 'tt'],
    inHelp: 'yes',
    usage: 's.test NOT SURE CHANGES',
    example: 's.test NOT SURE CHANGES',
    permissions: '',
    ownerOnly: 'yes',
    note: 'This command changes so much, just look at the code...',
    async execute(message, args, client) {

        let tests = args.slice(0).join(' ').split("|");
        let test0 = [];
        tests.forEach(test0 => {
            tests.push(test0);
        });


        message.attachments.forEach(async attachment => { // found online
            // do something with the attachment
            const url = attachment.url;
            //console.log(url)
            await connection.query(
                `INSERT INTO fileImportTest (fileTest, test2, test3, test4) VALUES(?, ?, ?, ?);`,
                [url, tests[0], tests[1], tests[2]]
            );
        });

        let test = '';
        let test2 = '';
        let test3 = '';
        let test4 = '';

        const results = await connection.query(
            `SELECT * FROM fileImportTest;`
        )
        for (let i = 0; i < results[0].length; i++) {
            const data = results[0]
            const file = data[i].fileTest;
            const tests2 = data[i].test2;
            const tests3 = data[i].test3;
            const tests4 = data[i].test4;

            test += `${i + 1}. ${file}\n`;
            test2 += `${i + 1}. ${tests2}\n`
            test3 += `${i + 1}. ${tests3}\n`
            test4 += `${i + 1}. ${tests4}\n`
        }


        const embed = new Discord.MessageEmbed()
            .setColor('WHITE')
            .setTitle('Title')
            .setDescription('Description')
            .addFields({
                name: 'File',
                value: `${test}`,
                inline: false
            }, {
                name: 'Others 2',
                value: `${test2}`,
                inline: false
            }, {
                name: 'Others 3',
                value: `${test3}`,
                inline: false
            }, {
                name: 'Others 4',
                value: `${test4}`,
                inline: false
            })
        message.channel.send(embed);

    }
}