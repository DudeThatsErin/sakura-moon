module.exports = {
    name: 'coinflip',
    description: 'Flip a coin and get heads or tails.',
    execute(interaction) {
        const coins = ["heads", "tails"];
        const coinz = coins[Math.floor(Math.random() * coins.length)];

        interaction.editReply({ content: `I got \`${coinz}\`!` });

    }
}