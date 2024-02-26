const { SlashCommandBuilder, CommandInteraction } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder().setName(`ping`).setDescription(`Replies with Pong!`),
    /**
     *
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const clientPing = reply.createdTimestamp - interaction.createdTimestamp;
        const websocketPing = interaction.client.ws.ping;

        await interaction.editReply({
            content: `Pong!\n**Client: **\`${clientPing}\` ms\n**Websockeet: **\`${websocketPing}\` ms`
        });
    }
};
