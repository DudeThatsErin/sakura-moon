const config = require('../config/config.json');
const Discord = require('discord.js');
const ee = require('../config/embed.json');
const bot = require('../config/bot.json');
const client = require("../index");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isMessageComponent()) return;
        if (!client.slashCommands.has(interaction.commandName)) return;
        // Slash Command Handling
        if (interaction.isCommand()) {
            await interaction.deferReply({ ephemeral: false }).catch(() => { });

            const cmd = client.slashCommands.get(interaction.commandName);
            if (!cmd)
                return interaction.followUp({ content: 'Oh no! An *error* has appeared!' });

            const args = [];

            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);

            if (!interaction.member.permission.has(cmd.userPermissions) || []) return interaction.followUp({ content: 'You do not have the required permissions to run this command.' });

            try {
                cmd.run(client, interaction, args);
            } catch (error) {
                console.error(error);
                const embed = new Discord.MessageEmbed()
                    .setColor(ee.bad_color)
                    .setTitle('Oh no! An _error_ has appeared!')
                    .setDescription(`**Contact Bot Owner:** <@${config.bot.ownerID}>`)
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
                        value: `Run the \`${config.bot.prefix}report\` command, [Fill out this form](https://codinghelp.site/contact-us/), Message her on Discord, or Email her at me@dudethatserin.site\n\nPlease include all of the information in this embed (message) as well as any additional information you can think to provide. Screenshots are also VERY helpful. Thank you!`
                    })
                    .setTimestamp()
                    .setFooter(`Thanks for using ${client.user.tag}! I'm sorry you encountered this error!`, `${client.user.displayAvatarURL()}`);
                interaction.editReply({ embeds: [embed], ephemeral: true });
            }
        

            // Context Menu Handling
            if (interaction.isContextMenu()) {
                await interaction.deferReply({ ephemeral: false });
                const command = client.slashCommands.get(interaction.commandName);
                if (command) command.run(client, interaction);
            }
        }
    }
}