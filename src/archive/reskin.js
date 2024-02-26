const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder().setName(`reskin`).setDescription(`change your explores skin!`),
    async execute(interaction) {
        await interaction.reply(`Pong!`);
    },
};
