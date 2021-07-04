const Discord = require('discord.js');

module.exports = {
    name: 'server',
    aliases: ['server-welcome', 'welcome', 'discord', 'roles', 'faq'],
    description: 'Pushes an embed to display in the channel about a the server.',
    usage: 's.server',
    note: '',
    permissions: '',
    ownerOnly: 'yes',
    async execute(message, args, client) {

        /*
        let embed1 = new Discord.MessageEmbed()
            .setColor('#EB74EE')
            .setTitle('Welcome to Sakura Moon\'s Development Support Server!')
            .setThumbnail('https://codinghelp.site/bots/sm/neon-moon.jpg')
            .setDescription(`Please read the rules thoroughly to get access to the server.`)
            .addFields(
                {name: 'Rule 1', value: 'No spamming, advertising, or illegal activity.'},
                {name: 'Rule 2', value: 'No hateful or inappropriate messages.'},
                {name: 'Rule 3', value: 'No excessive cursing towards another member in a disrespectful way.'},
                {name: 'Rule 4', value: 'When asking questions, please provide as much information as possible.'},
                {name: 'Rule 5', value: `Do not ping <@455926927371534346> or any moderator or user without a good reason. You may only ping <@&850989636657610782> if you have an urgent need for help. If you are caught spamming this role, you will be muted.`},
                {name: 'Rule 6', value: 'Do not impersonate anyone, especially mods.'}
            )
            .setTimestamp()
            .setFooter('Created by DudeThatsErin#8061', 'https://codinghelp.site/bots/sm/neon-moon.jpg');

        message.delete();
        message.channel.send(embed1);
                */
        /* FAQ */
        message.delete();
        let embed2 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('Do you have a frequently asked question? This is the best place to check!')
            .setDescription('Please read all of the questions below before asking a question so that you are not referred here after asking your question.')
            .setTimestamp()
            .setFooter('Please ping @URGENT for urgent help.', 'https://codinghelp.site/bots/sm/neon-moon.jpg');

        message.channel.send(embed2);

        let embed3 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('How do I become a patron?')
            .setDescription('Great question! All you need to do is go to [My Patreon](https://www.patreon.com/SakuraMoon) and join there! If you would like to donate another way, please open a <@575252669443211264> ticket and Erin will give you an alternative way. She appreciates the donation in advance!');
        message.channel.send(embed3);

        let embed4 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('A command ran but did not work. I did not get an error message either. What is going on?')
            .setDescription('Oh no! That is not good. Please give Erin the exact command that was run, including all of the arguments with the command (username, user\'s ID, reason message, or whatever else was included with the command) as well as what you were trying to do and what happened and she can research this.');
        message.channel.send(embed4);

        let embed5 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('Why does Sakura Moon need administrative privileges? I don\'t like giving that out.')
            .setDescription('While that is understandable, Sakura Moon needs administrative privileges so that the Challenge System, Thanks System, and Suggestions System all work, regardless of whether you use them currently. This also allows for future commands to work without you needing to kick and re-add the bot in the future.');
        message.channel.send(embed5);

        let embed6 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('The bot isn\'t responding to any of my messages, what is going on?')
            .setDescription('Please check <#825857406088511528> for any outages that may be reported. It could be that the bot is offline for one reason or another or it could be that the bot was just restarting at that exact moment that you tried to run your command. Try your command again in 5-10 minutes and if an outage status is not posted in <#825857406088511528> then please let Erin know what is going on with as much detail as possible.');
        message.channel.send(embed6);

        let embed7 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('What is the Thanks System?')
            .setDescription('Great question! The thanks system gives your server the ability to track people who help out in your server. Every time someone says a variation of \`Thanks\` like \`thnx or thanks or thx etc.\` it responds telling them to use the \`thanks\` command to thank someone and it tracks users that help out on a top 10 leaderboard which then you can do whatever you\'d like with.');
        message.channel.send(embed7);

        let embed8 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('What is the Challenges System?')
            .setDescription('Great question! The challenges system gives your server the ability to provide challenges or contests to your members in your server. Your members will need to get a \`Participants\` role to participate in the challenges but the system includes a top 10 leaderboard, the ability to add an unlimited number of challenges, the ability to start the challenges and provide a 1st, 2nd, and 3rd place prizes, as well as a way to end the challenges so no more users can participate and much more. This is a huge system which is why it requires the largest [Patreon](https://www.patreon.com/SakuraMoon) membership to use.');
        message.channel.send(embed8);

        let embed9 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('What is the Suggestions System?')
            .setDescription('Great question! The suggestions system is a system that gives your server the ability to track suggestions as well as notify the authors of suggestions of the suggestion that they may have. A Patreon subscription is not required to use this command.');
        message.channel.send(embed9);

        let embed10 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('Are there any future commands or systems in the works?')
            .setDescription('I am slowly working on an audit log system that will display messages or embeds for each update on a server. This will be locked behind a patreon membership because of the amount of work that goes into creating something like this. Other than that, nothing else is in the works. If you would like to suggest something run the \`s.suggestions\` command.');
        message.channel.send(embed10)



        /* ROLES FOR REACT ROLES
        message.delete();

        let roleEmbed1 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('Colorize your Username/Nickname!')
            .setDescription('Change the color of your username/nickname by reacting to this message. The color you react to will determine the color of your username.');
        
        let roleEmbed2 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('What kind of notifications would you like to receive?')
            .setDescription('React to this message to get 🖥️ Server Updates or 🤖 Bot Updates or both!'); // server 850979569515102238 bot 850979691842109470
        
        let roleEmbed3 = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('React with 🐎 to this message to get access to the whole server.'); // 821170554908311572

        message.channel.send(roleEmbed1);
        message.channel.send(roleEmbed2);
        message.channel.send(roleEmbed3);
        */

        /* PATREON 
        message.delete();

        let patreon = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('You want to donate to the development of the bot? THANK YOU!')
            .setDescription('This is NOT REQUIRED by any means *but* it does open up more commands for you to use. If you decide to donate, thank you in advance!')
            .addFields({
                name: 'Patrons have access to the following commands:',
                value: 'Access to the \`Thanks System\` and \`Challenges System\` and \`Suggestions System\`. As well as any future systems I decide to create.'
            }, {
                name: 'How do I get the Patron role on this server and access to the Patron-only commands?',
                value: `Open a <@575252669443211264> ticket or message Erin on Patreon and she will give it to you manually.`
            })

        message.channel.send(patreon);
        */

        /* COMMANDS 
            message.delete();

            let commands = new Discord.MessageEmbed()
                .setColor('#EB74EE')
                .setTitle('This is a list of every single command that is available on Sakura Moon.')
                .setDescription('If anything is incorrect here, please report it to the dev!');
            
                let prefix = client.guildCommandPrefixes.get(message.guild.id);

            let embed1 = new Discord.MessageEmbed()
                .setColor('#EB74EE')
                .setTitle('General Commands')
                .setDescription(`These are all of the commands Sakura Moon can do. If you want to get more information you can do \`${prefix}help <command>\`. Clicking the emojies at the bottom of this message will allow you to go through all of our commands.`)
                .addFields(
                    { name: 'These are commands any user can use.', value: '```css\nping\navatar\nuser-info\nserver-info\nbot-info\ninvite\nhelp\n```' },
                );
                
            let embed2 = new Discord.MessageEmbed()
                .setColor('#EB74EE')
                .setTitle('Suggestion System Commands')
                .setDescription(`These are all of the commands Sakura Moon can do. If you want to get more information you can do \`${prefix}help <command>\`. Clicking the emojies at the bottom of this message will allow you to go through all of our commands.`)
                .addFields(
                    { name: 'These are commands any user can use for our Suggestions System.', value: '```css\nsuggestions\neditsugg\nstatussug\n```' },
                    { name: 'These are our **moderator** only commands for our Suggestions System.', value: '```css\nprog-sugg\ndenied-sugg\ncompletedsugg\n```' }
                );
                
            let embed3 = new Discord.MessageEmbed()
                .setColor('#EB74EE')
                .setTitle('Challenge System Commands')
                .setDescription(`These are all of the commands Sakura Moon can do. If you want to get more information you can do \`${prefix}help <command>\`. Clicking the emojies at the bottom of this message will allow you to go through all of our commands.`)
                .addFields(
                    { name: 'These are commands any user can use for our Challenge System.', value: '```css\nsubmit\nedit-submission\nchallenge-leaderboard\n```' },
                    { name: 'These are our **moderator** only commands for our Challenge System.', value: '```css\nadd-members\nadd-users\ncheck-participants\nremove-participant\nstart-challenge\nchallenge\nedit-challenge\ncheck-submissions\nreviewed\npurge-submissions\nend-challenge\n```' }
                );
        
            let embed4 = new Discord.MessageEmbed()
                .setColor('#EB74EE')
                .setTitle('Thanks System Commands')
                .setDescription(`These are all of the commands Sakura Moon can do. If you want to get more information you can do \`${prefix}help <command>\`. Clicking the emojies at the bottom of this message will allow you to go through all of our commands.`)
                .addFields(
                    { name: 'These are teh commands you can use for our Thanks System.', value: '```css\nthanks\nthanks-on\nthanks-off\nthanks-leaderboard\n```' }
                );
                
            let embed5 = new Discord.MessageEmbed()
                .setColor('#EB74EE')
                .setTitle('Moderator Only Commands')
                .setDescription(`These are all of the commands Sakura Moon can do. If you want to get more information you can do \`${prefix}help <command>\`. Clicking the emojies at the bottom of this message will allow you to go through all of our commands.`)
                .addFields(
                    { name: 'These are general **moderator** only commands. Meaning only **moderators** can use these commands.', value: '```css\nprune\nupdate-prefix\nreset-prefix\nmute\nunmute\nwarn\nkick\nban\nunban\n```' }
                );

            message.channel.send(commands);
            message.channel.send(embed1);
            message.channel.send(embed2);
            message.channel.send(embed3);
            message.channel.send(embed4);
            message.channel.send(embed5);

            */

        /* SUGGESTIONS EMBED 
        message.delete();

        let suggestions = new Discord.MessageEmbed()
            .setColor('#415BCE')
            .setTitle('Would you like to make a suggestion?')
            .setDescription('I appreciate the suggestion in advance! To suggest something run the \`s.suggestions\` command like so:\n\`\`\`s.suggestions I would like to suggest something!\`\`\`If you want to discuss a suggestion in this channel, you can do so in <#825857020753739806>. This channel is locked as the bot posts in this channel automatically. You can run the command in <#825856594045829150> though!')
        message.channel.send(suggestions);
        */

    }
};