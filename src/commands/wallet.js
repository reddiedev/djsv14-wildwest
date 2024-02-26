const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, inlineCode, time } = require(`discord.js`);
const { PrismaClient } = require(`@prisma/client`);
const dayjs = require(`../utils/datetime/dayjs-setup`);
const { emojis } = require(`../../config.json`);

const prisma = new PrismaClient();
module.exports = {
    data: new SlashCommandBuilder().setName(`wallet`).setDescription(`view the contents of your wallet!`),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            let currentDatetime = dayjs().toISOString();
            let player = await prisma.player.upsert({
                where: {
                    id: interaction.user.id,
                },
                update: {},
                create: {
                    id: interaction.user.id,
                    wallet: 0,
                    lastWorked: currentDatetime,
                },
            });
            let nickname = interaction.member.nickname ? interaction.member.nickname : interaction.user.username;
            let lastWorked = dayjs(player.lastWorked);
            let file = new AttachmentBuilder(`src/media/thumbnail.png`);

            let embed = new EmbedBuilder()
                .setTitle(`${nickname}'s wallet`)
                .setColor(`Random`)
                .setThumbnail(`attachment://thumbnail.png`)
                .addFields(
                    {
                        name: `${inlineCode(`Steam Name`)}`,
                        value: player.gameName ? `${player.gameName}` : `Unknown`,
                        inline: true,
                    },
                    {
                        name: `${inlineCode(`Balance`)}`,
                        value: `${player.wallet} ${emojis.coin}`,
                        inline: true,
                    },
                    {
                        name: `${inlineCode(`Last Worked`)}`,
                        value: `${time(lastWorked.toDate())}`,
                        inline: false,
                    }
                );
            await interaction.editReply({ embeds: [embed], files: [file] });
        } catch (err) {
            console.log(err);
        }
    },
};
