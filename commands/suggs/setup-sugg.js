const connection = require('../../database.js');
const fs = require('fs');
const {
    channelIDs
} = require('../../config.json');

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
    note: 'You must have one of the following permissions to run this command: \`ADMINISTRATOR, MANAGE_CHANNELS, MANAGE_ROLES, MANAGE_MESSAGES, KICK_MEMBERS, BAN_MEMBERS\`',
    patreonOnly: 'no',
    permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
    async execute(message, args) {

        message.reply('What name would you like to have for where people submit suggestions?');
        const name = args.join(' ');
        const suggestionsCH = await message.guild.channels.create(name, {
            type: 'text',
            reason: 'Sakura Moon needed a suggestions channel for the suggestions handler.',
            permissionOverwrites: [{
                id: message.guild.roles.everyone,
                deny: ['ADD_REACTIONS']
            }],
        });
        const suggID = suggestionsCH.id;
        if (channelIDs.includes(`${suggID}`)) {
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
        if (channelIDs.includes(`${discID}`)) {
            message.channel.send('I have created the discussions channel for the Suggestions System and stored the ID in my database.');
        } else {
            addChannelID(`${discID}`);
            message.channel.send('I have created the suggestions channel and stored the ID in my database.');
        }

    }
}