const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();
const shoplog = require(`../logs/shoplog`);
const { inlineCode, userMention, Message } = require(`discord.js`);
const { emojis } = require(`../../../config.json`);
/**
 * 
 * @param {Message} message 
 * @returns {void}
 */
async function processLogout(message) {
    return new Promise(async (resolve, reject) => {
        try {
            let messageArgs = message.cleanContent.split(`;`);
            let hours = parseInt(messageArgs[2].trim());
            let minutes = parseInt(messageArgs[3].trim());
            let playerInfo = messageArgs[1].trim();
            let playerArgs = playerInfo.split(` `);
            let playerName = playerArgs[0].trim();
            let totalMinutes = hours * 60 + minutes;
            let rewards = Math.floor(totalMinutes / 3);
            let player = await prisma.player.findFirst({
                where: {
                    gameName: playerName,
                },
            });
            if (!player) {
                await shoplog({
                    title: `Player Name Not found`,
                    color: `Red`,
                    description: `${inlineCode(playerName)} not found in the database. They would have received ${rewards} ${emojis.coin} `,
                });
            } else {
                await prisma.player.update({
                    where: {
                        gameName: playerName,
                    },
                    data: {
                        wallet: {
                            increment: rewards,
                        },
                    },
                });
                await shoplog({
                    title: `User logged out`,
                    color: `Green`,
                    description: `${userMention(player.id)} (${inlineCode(playerName)}) has received ${rewards} ${emojis.coin
                        } for being online for ${hours} hours and ${minutes} minutes `,
                });
            }
            resolve();
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

module.exports = processLogout;
