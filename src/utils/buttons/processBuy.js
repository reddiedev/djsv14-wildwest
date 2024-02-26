const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();
const {
    inlineCode,
    bold,
    PermissionsBitField,
    roleMention,
    userMention,
    EmbedBuilder,
    AttachmentBuilder,
    channelMention,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require(`discord.js`);
const { prices } = require(`../../../config.json`);
const dayjs = require(`../datetime/dayjs-setup`);
const shoplog = require(`../logs/shoplog`);

const STORM_COOLDOWN = 1; // 1 hour
const TIME_COOLDOWN = 1; // 1 hour

async function processBuy(interaction) {
    return new Promise(async (resolve) => {
        let status = require(`../../../status`);

        await interaction.deferUpdate();
        let id = interaction.customId;
        let item = id.replace(`buy:`, ``);
        let player = await prisma.player.findUnique({
            where: {
                id: interaction.user.id,
            },
        });
        if (player == null || player.gameName == null) {
            await interaction.followUp({
                content: `Please use the ${inlineCode(`/register`)} command to set your ${bold(`Steam Name`)} with the bot`,
                ephemeral: true,
            });
            return;
        }

        // check if player has enough money
        let itemCost = prices[`${item}`];
        let currentBalance = player.wallet;

        if (currentBalance < itemCost) {
            await interaction.followUp({
                content: `Unfortunately, you do not have enough balance to purchase this item. Earn some and come back to the shop!`,
                ephemeral: true,
            });
            return;
        }
        let currentTime = dayjs();
        // check if item has been redeemed too many times
        if (item == `storm`) {
            let lastStorm = status.lastStorm;
            let diff = Math.abs(lastStorm.diff(currentTime, `hour`, true));
            if (diff <= STORM_COOLDOWN) {
                let minutesLeft = (STORM_COOLDOWN - diff) * 60;
                await interaction.followUp({
                    content: `Unfortunately, you have to wait for ${minutesLeft.toFixed(2)} more minutes to use this command`,
                    ephemeral: true,
                });
                return;
            } else {
                status.lastStorm = currentTime;
            }
        } else if (item == `day` || item == `night`) {
            let lastTime = status.lastTime;
            let diff = Math.abs(lastTime.diff(currentTime, `hour`, true));
            if (diff <= TIME_COOLDOWN) {
                let minutesLeft = (TIME_COOLDOWN - diff) * 60;
                await interaction.followUp({
                    content: `Unfortunately, you have to wait for ${minutesLeft.toFixed(2)} more minutes to use this command`,
                    ephemeral: true,
                });
                return;
            } else {
                status.lastTime = currentTime;
            }
        }

        // create the channel
        let playerNickname = interaction.member.nickname ? interaction.member.nickname : interaction.user.username;
        let channel = await interaction.guild.channels.create({
            name: `🎫${playerNickname}-${item}`,
            parent: process.env.shopTicketsCategoryID,
            permissionOverwrites: [
                { id: process.env.everyoneRoleID, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: process.env.staffRoleID, allow: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id.toString(), allow: [PermissionsBitField.Flags.ViewChannel] },
            ],
        });

        // ping the staff
        await channel.send(`${userMention(interaction.user.id)}${roleMention(process.env.staffRoleID)}`);

        // send detailed message
        let command = `command`;
        if (item == `storm`) {
            command = `ForceStorm`;
        } else if (item == `reskin`) {
            command = `Reskin ${player.gameName}`;
        } else if (item == `regender`) {
            command = `Setgender Male ${player.gameName}\nSetgender Female ${player.gameName}`;
        } else if (item == `retalent`) {
            command = `Retalent Male ${player.gameName}`;
        } else if (item == `day`) {
            command = `Settimeofday 7:00`;
        } else if (item == `night`) {
            command = `Settimeofday 18:00`;
        }
        let file = new AttachmentBuilder(`src/media/thumbnail.png`);
        let embed = new EmbedBuilder()
            .setTitle(`🛒 Buy ${item}`)
            .setColor(`Random`)
            .setThumbnail(`attachment://thumbnail.png`)
            .addFields(
                { name: `Buyer Info`, value: `${userMention(interaction.user.id)}\n${player.gameName}`, inline: true },
                { name: `Item`, value: item, inline: true },
                { name: `Command`, value: inlineCode(command), inline: true }
            );
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`closeticket`).setLabel(`Close Ticket`).setStyle(ButtonStyle.Danger).setEmoji(`🛑`)
        );
        await channel.send({ embeds: [embed], files: [file], components: [row] });

        // remove coins from player
        await prisma.player.update({
            where: {
                id: interaction.user.id,
            },
            data: {
                wallet: {
                    decrement: itemCost,
                },
            },
        });

        // log event
        await shoplog({
            title: `Item bought`,
            color: `Green`,
            description: `${userMention(player.id)} (${inlineCode(player.gameName)}) bought ${item} in ${channelMention(channel.id)}`,
        });

        resolve();
    });
}

module.exports = processBuy;
