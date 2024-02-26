const { SlashCommandBuilder, userMention } = require(`discord.js`);
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();
const shoplog = require(`../utils/logs/shoplog`);
const dayjs = require(`../utils/datetime/dayjs-setup`);
const { workRewards, emojis } = require(`../../config.json`);
const WORK_COOLDOWN = 2; // 2 hours

module.exports = {
    data: new SlashCommandBuilder().setName(`work`).setDescription(`work to earn some money!`),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        try {
            let currentDatetime = dayjs();
            let currentDatetimeString = currentDatetime.toISOString();
            // add the user to the database if not already in it
            let player = await prisma.player.upsert({
                where: {
                    id: interaction.user.id,
                },
                update: {},
                create: {
                    id: interaction.user.id,
                    wallet: 0,
                    lastWorked: currentDatetimeString,
                },
            });
            let lastWorked = player.lastWorked;
            let hoursDiff = Math.abs(currentDatetime.diff(lastWorked, `hour`, true));
            if (hoursDiff <= WORK_COOLDOWN) {
                let minutes = (WORK_COOLDOWN - hoursDiff) * 60;
                await interaction.editReply({
                    content: `Unfortunately ${userMention(interaction.user.id)}, you have to wait for ${minutes.toFixed(2)} more minutes to work again!`,
                });
            } else {
                let min = workRewards.min;
                let max = workRewards.max;
                let reward = Math.floor(Math.random() * (max - min) + min);
                await prisma.player.update({
                    where: {
                        id: interaction.user.id,
                    },
                    data: {
                        wallet: {
                            increment: reward,
                        },
                        lastWorked: currentDatetimeString,
                    },
                });
                await interaction.editReply({
                    content: `Congratulations ${userMention(interaction.user.id)}! You worked for ${reward} ${emojis.coin}`,
                });
                await shoplog({
                    title: `User Worked`,
                    color: `Blue`,
                    description: `${userMention(interaction.user.id)} worked for ${reward} ${emojis.coin}`,
                });
            }
        } catch (err) {
            console.log(err);
            await interaction.editReply({
                content: `There was an error processing your work command`,
            });
        }
    },
};
