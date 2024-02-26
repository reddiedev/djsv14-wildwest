const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder().setName(`night`).setDescription(`set world to night time`),
    async execute(interaction) {
        await interaction.reply(`Pong!`);
    },
};
