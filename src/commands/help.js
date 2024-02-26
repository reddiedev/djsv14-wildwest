const { SlashCommandBuilder, EmbedBuilder, inlineCode } = require(`discord.js`);
const path = require(`node:path`);
const fs = require(`fs`);
module.exports = {
    data: new SlashCommandBuilder().setName(`help`).setDescription(`info regarding each slash command`),
    async execute(interaction) {
        const commandsPath = __dirname;
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(`.js`));

        const embed = new EmbedBuilder()
            .setTitle(`Help`)
            .setDescription(`this is a list of all of this bot's slash commands`)
            .setColor(`Random`)
            .setFooter({ text: `If you have any questions, please don't hesitate to contact one of the server admins` });

        const fields = [];

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            fields.push({ name: inlineCode(`/` + command.data.name.toString()), value: command.data.description.toString(), inline: false });
        }
        embed.addFields(fields);
        await interaction.reply({ embeds: [embed] });
    },
};
