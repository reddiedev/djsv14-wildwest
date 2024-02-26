const { SlashCommandBuilder, userMention, roleMention, bold, inlineCode } = require(`discord.js`);
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();
const dayjs = require(`../utils/datetime/dayjs-setup`);
const shoplog = require(`../utils/logs/shoplog`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`register`)
        .setDescription(`register your game id to this bot to receive rewards!`)
        .addStringOption((option) => option.setName(`name`).setDescription(`your name in steam`).setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const gameName = interaction.options.getString(`name`);
        try {
            // checks if someone already has that name
            let prevPlayer = await prisma.player.findFirst({
                where: {
                    gameName: gameName,
                },
            });
            if (prevPlayer) {
                await interaction.editReply({
                    content: `${userMention(prevPlayer.id)} already owns ${inlineCode(gameName)}. Contact a ${roleMention(
                        process.env.staffRoleID
                    )} if you think this is a mistake`,
                });
                return;
            }
            let currentDatetime = dayjs().toISOString();
            // add the user to the database if not already in it
            await prisma.player.upsert({
                where: {
                    id: interaction.user.id,
                },
                update: {
                    gameName: gameName,
                },
                create: {
                    id: interaction.user.id,
                    wallet: 0,
                    lastWorked: currentDatetime,
                    gameName: gameName,
                },
            });
            await interaction.editReply({
                content: `Done adding ${userMention(interaction.user.id)} to the database! \n${bold(`Name:`)} ${inlineCode(gameName)}`,
            });
            await shoplog({
                title: `New User`,
                color: `Green`,
                description: `Done adding ${userMention(interaction.user.id)} to the database! \n${bold(`Name:`)} ${inlineCode(gameName)}`,
            });
        } catch (err) {
            console.log(err);
            await interaction.editReply({
                content: `Error adding ${userMention(interaction.user.id)} to the database!\n${bold(`Name:`)} ${inlineCode(gameName)}`,
            });
        }
    },
};
