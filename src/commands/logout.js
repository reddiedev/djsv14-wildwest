const { SlashCommandBuilder, WebhookClient } = require(`discord.js`);
const webhookClient = new WebhookClient({ url: process.env.GAMELOGS_WEBHOOK_URL });

module.exports = {
    data: new SlashCommandBuilder().setName(`logout`).setDescription(`send test logout message`),
    async execute(interaction) {
        await interaction.reply({ content: `Sending logout`, ephemeral: true });
        await webhookClient.send(`Logout;Alkazair <76561198081618049> ;7;34`);
    },
};
