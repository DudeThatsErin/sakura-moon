const Discord = require('discord.js');
const connection = require('../../database.js');
const embed = require('../../config/embed.json');
const config = require('../../config/config.json');

module.exports = {
    name: 'start-challenge',
    description: 'This gives **mods** the ability to start a challenge by storing the prizes for 1st, 2nd and 3rd place as well as the announcements channel ID.',
    aliases: ['sc', 'start', 'startchallenge', 'startc', 'startchall'],
    usage: 's.start-challenge [announcements channel ID] [challenge moderator role ID] [prize 1|prize 2|prize 3]',
    example: 's.start-challenge 841366694948765786 84136123459876578 Nitro|Nitro Classic|Special Role',
    inHelp: 'yes',
    cooldown: 1000,
    userPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_ROLES', 'MANAGE_NICKNAMES'],
    botPerms: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
    async execute (message, args) {
        let announcementsChannel = args[0];
        let roleID = args[1];
        let guild = message.guild.id;
        let mod = message.author.id;
        let prize = [];
        let prizes = args.slice(2).join(' ').split("|");
        if (!announcementsChannel) {
            message.reply('You need to include the ID of the channel where you want me to post the Challenge Questions!');
            return;
        } else {
            if (!roleID) {
                message.reply('You need to include the ID of the participants role so that I can ping them when new challenge questions get posted.')
                return;
            } else {
                if (prizes.length < 3) {
                    message.reply('What prizes did you want to the top 3 users to get? You will need to post it like this: \`prize 1|prize 2|prize 3\`. If you don\'t understand, you can ask for explanation from the developer or your mods.');
                    return;
                } else {
                    prizes.forEach(prize => {
                        prizes.push(prize);
                    });
                    const rules = new Discord.MessageEmbed()
                        .setColor(embed.start_ch)
                        .setTitle(`Our Challenge has started!`)
                        .setDescription(`If you would like to participate, please ask your moderators how to get the <@&${roleID}> role. Please read our rules, they explain how to use our challenge system!`)
                        .addFields(
                            { name: 'Commands', value: `These are the commands you can use with our system.\n\`${config.prefix}submit [challenge number] [answer]\` - This is how you submit answers to our challenges.\n\`${config.prefix}leaderboard\` - This is how you check the leaderboard for the challenge. It displays the top 10 users.\n\`${config.prefix}edit-submission\` - This is how you edit your submission for the challenge. You can only edit it until it has been reviewed. Once a submission has been reviewed, you may not edit it.` },
                            { name: 'Rules', value: '1. Please be courteous to our fellow participants. Being rude, degrading, etc. will get you disqualified from the challenge.\n2. Please only submit once to each challenge. Multiple submissions can and will cause issues.' },
                            { name: 'Prizes', value: `🥇 First Place: ${prizes[0]}\n🥈 Second Place: ${prizes[1]}\n🥉 Third Place: ${prizes[2]}` }
                        )
                        .setFooter('Thanks for participating in our challenge! Good luck!', embed.footericon);

                    const mods = new Discord.MessageEmbed()
                        .setColor(embed.modEmbed)
                        .setTitle('Thanks for starting the Challenge System!')
                        .setDescription(`The message has been posted to <#${announcementsChannel}> and everything has been added to the database! The message includes a message telling users how to use the challenge system. Please read below to see how mods can use the system. The commands listed below can only be used by users with the \`KICK MEMBERS\` or \`MANAGE MEMBERS\` permissions. That is how Sakura Moon determines a moderator.`)
                        .addFields(
                            { name: 'Tips', value: `Before you post your first question, you will want to make sure to add the users with the <@&${roleID}> role to the database. If users try to answer without this role, it will not let them. To do that Sakura Moon has a few commands:\n\`${config.prefix}add-members\` - Your mods can automatically add participants to the Challenges database.\n\`${config.prefix}add-user\`- Your mods can manually add users to the participants database.\n\`${config.prefix}check-members\`- Your mods can check to see who is currently in the Challenges database.\n\nIf you are looking to remove one or more users from the database you can use the following commands to remove users and/or points:\n\`${config.prefix}remove-participants\`- Your mods can remove a user as a participant from the Challenge System which does not allow them to submit answers to the system.\n\`${config.prefix}remove-points\`- Your mods can mark a submission as un-reviewed and remove points from that submission.` },
                            { name: 'Challenge Question Commands', value: `These are all of the commands your mods can use to manage the challenge questions:\n\`${config.prefix}challenge\`- This will allow your mods to add challenge questions to the system.\n\`${config.prefix}edit-challenge\`- This will allow your mods to edit previously posted challenge questions.\n\`${config.prefix}mod-check-submissions\`- This will allow your mods to check on submission that have been submitted to the challenge system.` },
                            { name: 'Submission Commands', value: `These are all of the commands your mods can use to manage submissions:\n\`${config.prefix}reviewed\`- This will allow your mods to mark submissions as reviewed and give them points.\n\`${config.prefix}add-points\`- This will allow your mods to manually add additional points to a submission.\n\`${config.prefix}remove-submission\`- This will allow your mods to manually remove a submission from the database.\n\`${config.prefix}purge-submissions\`- This will allow your mods to completely erase all submissions for your guild (server) from the database.\n\`${config.prefix}end-challenge\`- This will allow your mods to end the challenge system completely. This erases everything from the database and restarts the system like it was never started. This does *not* delete channels from your server.` },
                            { name: 'FAQs', value: `Currently, the system seems pretty simple. If you have any questions, please contact the dev and let her know.` }
                        )
                        .setFooter(embed.footertext, embed.footericon);
                    
                    const result5 = await connection.query(
                        `SELECT guildId from Challenge WHERE guildId = ?;`,
                        [guild]
                    );
                    if (result5[0][0] == undefined) {
                        
                        const msg = message.id;
                        try {
                            await connection.query(
                                `INSERT INTO Challenge (msgId, guildId, partRoleiD, prize1, prize2, prize3, channelD, moderator) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                                [msg, guild, roleID, prizes[0], prizes[1], prizes[2], announcementsChannel, mod]
                            );
                            message.guild.channels.cache.get(announcementsChannel).send({ embeds: [rules] });
                            message.channel.send({ embeds: [mods] });
                        } catch {
                            message.react('❗');
                            message.reply('There was an error adding this information to the database. Please let the dev know by using the \`s.report\` command. Thank you!');
                            console.log('This is the information I was trying to add to the DB:\n\nguildId: ' + guild + '\nmsg id: ' + msg + '\nannouncements CH id: ' + announcementsChannel + '\nparticipants role ID: ' + roleID + '\nmod ID to start challenge system: ' + mod + '\nprizes: ' + prizes[0] + ' ' + prizes[1] + ' ' + prizes[2]);
                        }
                    }
                    else {
                        message.react('❗');
                        message.reply('It looks like you already have a challenge going on in your server. Please run \`s.end-challenge\` first before starting a new challenge. If you are seeing this message in error, please report it with \`s.report\`');
                        console.log(`There was an error in guild ID: ${guild} & guild name: ${message.guild.name}\nThey tried to start a challenge system with one going.\nAuthor: ${message.author.username} with ID: ${message.author.id} ran this message: ${message.content}`);
                    }
                }
            }
        }

    }
}