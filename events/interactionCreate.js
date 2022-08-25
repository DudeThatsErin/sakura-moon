const Discord = require('discord.js');
const ee = require('../config/embed.json');
const o = require('../config/dev.json');
const connection = require('../database.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const stuff = await connection.query(
            `SELECT * FROM guildConfig WHERE guildId = ?;`,
            [interaction.guild.id]
        );
        const prefix = stuff[0][0].prefix;
        const ownerId = stuff[0][0].ownerId;
        
        //console.log(interaction);
        if (interaction.isMessageComponent()) return;
        if (!interaction.isCommand()) return interaction.editReply({ content: 'That is not a valid slash command.' });
        if (!client.slashCommands.has(interaction.commandName)) return;

        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return interaction.editReply({ content: 'This command no longer exists.' });

        // guild owner only
        let owner = await interaction.guild.fetchOwner();
        if(interaction.guildOwnerOnly === 1) {
            if(!interaction.author.id === owner.id) {
                return interaction.editReply({ content: `This is a command only the Guild/Server owner can use. If you are seeing this in error use the \`${prefix}report\` command.`})
            }
        }

        // dev only
        if (interaction.erinOnly === 1) {
            if (!message.author.id === o.id) {
                return message.reply({ content: `This is only a command Erin (<@${me.id}>) can use. If you are seeing this in error use the \`${prefix}report\` command.` });
            }
        }

        // command cooldowns
        // NEED TO GET THIS WORKING.

        // actually running the commands.
        try {
            await interaction.deferReply();
            await client.slashCommands.get(interaction.commandName).execute(interaction, client);
        } catch (error) {
            console.error(error);
            const embed = new Discord.EmbedBuilder()
                .setColor(ee.red)
                .setTitle('Oh no! An _error_ has appeared!')
                .setDescription(`**Contact Bot Owner:** <@${o.id}>`)
                .addFields({
                    name: '**Error Name:**',
                    value: `\`${error.name}\``
                }, {
                    name: '**Error Message:**',
                    value: `\`${error.message}\``
                }, {
                    name: '**Error Location:**',
                    value: `\`${error.stack}\``
                }, {
                    name: '**Ways to Report:**',
                    value: `Run the \`${prefix}report\` command, [Fill out this form](https://codinghelp.site/contact-us/), Message her on Discord, or Email her at me@erinskidds.com\n\nPlease include all of the information in this embed (message) as well as any additional information you can think to provide. Screenshots are also VERY helpful. Thank you!`
                })
                .setTimestamp()
                .setFooter({ text:`Thanks for using ${client.user.tag}! I'm sorry you encountered this error!`, icon_url: `${client.user.displayAvatarURL()}`});
            interaction.editReply({ embeds: [embed] });
        }
    }
};