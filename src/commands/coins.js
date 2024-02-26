const { SlashCommandBuilder, userMention } = require(`discord.js`);
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();
const dayjs = require(`../utils/datetime/dayjs-setup`);
const shoplog = require(`../utils/logs/shoplog`);
const { emojis } = require(`../../config.json`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`coins`)
        .setDescription(`commands regarding player wallets | admin-only`)
        .addSubcommand((subcommand) =>
            subcommand
                .setName(`add`)
                .setDescription(`adds coins to a user `)
                .addUserOption((option) => option.setName(`target`).setDescription(`the user who will receive coins`).setRequired(true))
                .addIntegerOption((option) => option.setName(`amount`).setDescription(`the amount of coins user will receive`).setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(`remove`)
                .setDescription(`removes coins from a user `)
                .addUserOption((option) => option.setName(`target`).setDescription(`the user who will lose coins`).setRequired(true))
                .addIntegerOption((option) => option.setName(`amount`).setDescription(`the amount of coins user will lose`).setRequired(true))
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            let userRoles = interaction.member.roles.cache;
            if (!userRoles.has(process.env.staffRoleID)) {
                await interaction.editReply({ content: `Unfortunately, you may not access this command` });
                return;
            }

            const target = interaction.options.getUser(`target`);
            const amount = interaction.options.getInteger(`amount`);
            const subcommand = interaction.options.getSubcommand(true);
            let currentDatetime = dayjs();
            let currentDatetimeString = currentDatetime.toISOString();
            if (subcommand == `add`) {
                await prisma.player.upsert({
                    where: {
                        id: target.id,
                    },
                    update: {
                        wallet: {
                            increment: amount,
                        },
                    },
                    create: {
                        id: target.id,
                        wallet: amount,
                        lastWorked: currentDatetimeString,
                    },
                });
                await shoplog({
                    title: `Coins Added`,
                    color: `Orange`,
                    description: `${userMention(interaction.user.id)} added ${amount} ${emojis.coin} to ${userMention(target.id)}'s wallet`,
                });
                await interaction.editReply({
                    content: `${userMention(interaction.user.id)} added ${amount} ${emojis.coin} to ${userMention(target.id)}'s wallet`,
                });
            } else if (subcommand == `remove`) {
                await prisma.player.upsert({
                    where: {
                        id: target.id,
                    },
                    update: {
                        wallet: {
                            decrement: amount,
                        },
                    },
                    create: {
                        id: target.id,
                        wallet: 0,
                        lastWorked: currentDatetimeString,
                    },
                });
                await shoplog({
                    title: `Coins Removed`,
                    color: `Orange`,
                    description: `${userMention(interaction.user.id)} removed ${amount} ${emojis.coin} from ${userMention(target.id)}'s wallet`,
                });
                await interaction.editReply({
                    content: `${userMention(interaction.user.id)} removed ${amount} ${emojis.coin} from ${userMention(target.id)}'s wallet`,
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
