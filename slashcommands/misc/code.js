module.exports = {
    name: 'code',
    description: 'Refers user to our r/CodingHelp for additional if they would like to learn how to code.',
    execute(interaction) {

        interaction.editReply({ content: 'Hey! Not sure if you knew this but you can visit r/CodingHelp to learn how to code. This is everywhere you can visit it:\n\nWebsite: https://codinghelp.site\nSubreddit: https://codinghelp.site/reddit/\nDiscord Server: https://codinghelp.site/discord', ephermal: true });
    },

};