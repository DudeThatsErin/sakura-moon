const Discord = require('discord.js');
const connection = require('../../database.js');
const fs = require('fs');
const { channelIDs } = require('../../config.json');

function addChannelID(suggID) {
    channelIDs.push(suggID);

    let newConfigObj = {
        ...require('../../config.json'),
        channelIDs
    };

    let newFileString = JSON.stringify(newConfigObj, null, 2);

    fs.writeFileSync('./config.json', newFileString);
}

module.exports = {
    name: 'setup-suggestions',
    aliases: ['setups', 'setup-suggs', 'setupsuggs', 'setupsuggestion', 'setupsugg', 'setup-sugg'],
    inHelp: 'yes',
    description: 'Sets up the Suggestions system and creates a Suggestions channel amd Discussions channel if there is not one. Stores the channel IDs for the bot to use. You **must** run this first before you can use the Suggestions system.',
    usage: 's.setup-suggs',
    note: 'In order for mods to be able to use this command, someone from the guild has to support the bot on [Patreon](https://www.patreon.com/SakuraMoon).',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    async execute(message, args) {

      const results = await connection.query(
        `SELECT * from Patrons WHERE guildId = ?;`,
        [message.guild.id]
    );
      if(results[0][0] === undefined || results[0][0] === 'undefined') return message.reply('Only patrons have access to use the Challenge System. If you would like to become a patron, check here on Patreon: https://www.patreon.com/SakuraMoon');
            message.reply('What name would you like to have for where people submit suggestions?');
            const name = args.join(' ');
            const suggestionsCH = await message.guild.channels.create(name, {
                type: 'text',
                reason: 'Sakura Moon needed a suggestions channel for the suggestions handler.',
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: ['ADD_REACTIONS']
                    }
                ],
            });
                const suggID = suggestionsCH.id;
                if(channelIDs.includes(`${suggID}`)) {
                    message.channel.send('I have created the suggestions channel and stored the ID in my database.');
                } else {
                    addChannelID(`${suggID}`);
                    message.channel.send('I have created the suggestions channel and stored the ID in my database.');
                }


            message.reply('What name would you like to have for where people can discuss suggestions?');
            const nameD = args.join(' ');
            const discussionsCH = await message.guild.channels.create(nameD, {
                type: 'text',
                reason: 'Sakura Moon needed a discussions channel for the suggestions handler.'
            });
                const discID = discussionsCH.id;
                if(channelIDs.includes(`${discID}`)) {
                    message.channel.send('I have created the discussions channel for the Suggestions System and stored the ID in my database.');
                } else {
                    addChannelID(`${discID}`);
                    message.channel.send('I have created the suggestions channel and stored the ID in my database.');
                }

    }
}
