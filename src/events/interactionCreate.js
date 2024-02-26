const closeTicket = require(`../utils/buttons/closeTicket`);
const processBuy = require(`../utils/buttons/processBuy`);

require(`discord.js`);
module.exports = {
    name: `interactionCreate`,
    async execute(interaction) {
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: `There was an error while executing this command!`,
                    ephemeral: true,
                });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith(`buy:`)) {
                await processBuy(interaction);
            } else if (interaction.customId == `closeticket`) {
                await closeTicket(interaction);
            }
        }
    },
};
