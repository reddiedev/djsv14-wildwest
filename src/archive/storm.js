const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder().setName(`storm`).setDescription(`start a random storm!`),
    async execute(interaction) {
        await interaction.reply(`Pong!`);
    },
};
