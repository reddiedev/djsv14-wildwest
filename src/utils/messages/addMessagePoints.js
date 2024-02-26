const { PrismaClient } = require(`@prisma/client`);
const dayjs = require(`../datetime/dayjs-setup`);
const prisma = new PrismaClient();
const { messageRewards } = require(`../../../config.json`);

async function addMessagePoints(message) {
    return new Promise(async (resolve) => {
        let currentDatetime = dayjs();
        let currentDatetimeString = currentDatetime.toISOString();
        let min = messageRewards.min;
        let max = messageRewards.max;
        let reward = Math.floor(Math.random() * (max - min) + min + 0.5);
        await prisma.player.upsert({
            where: {
                id: message.author.id,
            },
            update: {
                wallet: {
                    increment: reward,
                },
            },
            create: {
                id: message.author.id,
                wallet: 0,
                lastWorked: currentDatetimeString,
            },
        });
        resolve();
    });
}

module.exports = addMessagePoints;
