const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, inlineCode, bold, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const { emojis, prices } = require(`../../config.json`);

module.exports = {
    data: new SlashCommandBuilder().setName(`shop`).setDescription(`view the game item shop!`),
    async execute(interaction) {
        await interaction.deferReply();
        let file = new AttachmentBuilder(`src/media/thumbnail.png`);
        let embed = new EmbedBuilder()
            .setTitle(`🛒 Item Shop`)
            .setColor(`Random`)
            .setThumbnail(`attachment://thumbnail.png`)
            .setDescription(`To purchase any of the items below, please use the slash command appropriate to it\n${inlineCode(`/<item> <values>`)}`)
            .addFields(
                {
                    name: `${inlineCode(`Random Storm`)}`,
                    value: `Start a random storm!\n${bold(`Price:`)} ${prices.storm} ${emojis.coin}`,
                    inline: true,
                },
                {
                    name: `${inlineCode(`Reskin`)}`,
                    value: `Change your Explores skin!\n${bold(`Price:`)} ${prices.reskin} ${emojis.coin}`,
                    inline: true,
                },
                { name: `\u200b`, value: `\u200b`, inline: true },
                {
                    name: `${inlineCode(`Regender`)}`,
                    value: `Change your Explores gender!\n${bold(`Price:`)} ${prices.regender} ${emojis.coin}`,
                    inline: true,
                },
                {
                    name: `${inlineCode(`Retalent`)}`,
                    value: `Change your Explores talents!\n${bold(`Price:`)} ${prices.retalent} ${emojis.coin}`,
                    inline: true,
                },
                { name: `\u200b`, value: `\u200b`, inline: true },

                {
                    name: `${inlineCode(`Day Time`)}`,
                    value: `Set the current time to day time!\n${bold(`Price:`)} ${prices.day} ${emojis.coin}`,
                    inline: true,
                },
                {
                    name: `${inlineCode(`Night Time`)}`,
                    value: `Set the current time to night time!\n${bold(`Price:`)} ${prices.night} ${emojis.coin}`,
                    inline: true,
                },
                { name: `\u200b`, value: `\u200b`, inline: true }
            );

        const firstRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`buy:storm`).setLabel(`Random Storm`).setStyle(ButtonStyle.Danger).setEmoji(`🛒`),
            new ButtonBuilder().setCustomId(`buy:reskin`).setLabel(`Reskin`).setStyle(ButtonStyle.Success).setEmoji(`🛒`),
            new ButtonBuilder().setCustomId(`buy:regender`).setLabel(`Regender`).setStyle(ButtonStyle.Success).setEmoji(`🛒`)
        );
        const secondRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`buy:retalent`).setLabel(`Retalent`).setStyle(ButtonStyle.Success).setEmoji(`🛒`),
            new ButtonBuilder().setCustomId(`buy:day`).setLabel(`Day Time`).setStyle(ButtonStyle.Primary).setEmoji(`🛒`),
            new ButtonBuilder().setCustomId(`buy:night`).setLabel(`Night Time`).setStyle(ButtonStyle.Primary).setEmoji(`🛒`)
        );
        const components = [firstRow, secondRow];

        await interaction.editReply({ embeds: [embed], files: [file], components: components });
    },
};
