const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder().setName(`retalent`).setDescription(`change your explores talent!`),
    async execute(interaction) {
        await interaction.reply(`Pong!`);
    },
};
