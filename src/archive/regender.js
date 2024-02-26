const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder().setName(`regender`).setDescription(`change your explores gender!`),
    async execute(interaction) {
        await interaction.reply(`Pong!`);
    },
};
