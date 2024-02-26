const { SlashCommandBuilder, userMention, roleMention, bold, inlineCode } = require(`discord.js`);
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();
const dayjs = require(`../utils/datetime/dayjs-setup`);
const shoplog = require(`../utils/logs/shoplog`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`set`)
        .setDescription(`set a game id of a person to this bot | staff-only`)
        .addUserOption((option) => option.setName(`target`).setDescription(`person who will get registered`).setRequired(true))
        .addStringOption((option) => option.setName(`name`).setDescription(`name of person in steam`).setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const target = interaction.options.getUser(`target`);
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
                    id: target.id,
                },
                update: {
                    gameName: gameName,
                },
                create: {
                    id: target.id,
                    wallet: 0,
                    lastWorked: currentDatetime,
                    gameName: gameName,
                },
            });
            await interaction.editReply({
                content: `Done adding ${userMention(target.id)} to the database! \n${bold(`Name:`)} ${inlineCode(gameName)}`,
            });
            await shoplog({
                title: `New User`,
                color: `Green`,
                description: `Done adding ${userMention(target.id)} to the database! \n${bold(`Name:`)} ${inlineCode(gameName)}`,
            });
        } catch (err) {
            console.log(err);
            await interaction.editReply({
                content: `Error adding ${userMention(target.id)} to the database!\n${bold(`Name:`)} ${inlineCode(gameName)}`,
            });
        }
    },
};
