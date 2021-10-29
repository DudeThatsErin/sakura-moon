const ee = require('../../config/embed.json');
const discord = require('discord.js')
module.exports = {
    description: 'Allows users to see other users avatars in a big form.',
    name: "avatar",
    options: [
        {
            name: 'user',
            description: 'Which user\'s avatar would you like to see?',
            type: 6,
            required: false
        }
    ],
    note: 'If you would like to see your own avatar, leave the \'user\' field blank.',
    async execute(interaction, client) {
        let user = interaction.options.getUser('user') || client.users.cache.get(interaction.member.user.id);
        let avs = new discord.MessageEmbed()
            .setAuthor(
                `Avatar from: ${user.tag}`,
                user.displayAvatarURL({ dynamic: true }),
                "https://discord.gg/geQEUBm"
            )
            .setColor(ee.rand_color)
            .addField(
                "❱ PNG",
                `[\`LINK\`](${user.displayAvatarURL({ format: "png" })})`,
                true
            )
            .addField(
                "❱ JPEG",
                `[\`LINK\`](${user.displayAvatarURL({ format: "jpg" })})`,
                true
            )
            .addField(
                "❱ WEBP",
                `[\`LINK\`](${user.displayAvatarURL({ format: "webp" })})`,
                true
            )
            .setURL(
                user.displayAvatarURL({
                    dynamic: true,
                })
            )
            .setFooter(ee.footertext, ee.footericon)
            .setImage(
                user.displayAvatarURL({
                    dynamic: true,
                    size: 512,
                })
            );

        interaction.editReply({ embeds: [avs], ephermal: true })
    },

};