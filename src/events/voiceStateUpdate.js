const CHECK_INTERVAL = 1 * 60 * 1000;
const { PrismaClient } = require(`@prisma/client`);
const prisma = new PrismaClient();
const dayjs = require(`../utils/datetime/dayjs-setup`);
const shoplog = require(`../utils/logs/shoplog`);
const { userMention } = require(`discord.js`);
const { emojis } = require(`../../config.json`);
module.exports = {
    name: `voiceStateUpdate`,
    async execute(oldState, newState) {
        // user joined a voice channel
        if (oldState.channelId == null && newState.channelId !== null) {
            let channelName = newState.channel.name;
            console.log(`${newState.member.user.tag} joined vc in #${newState.channel.name}`);
            let minutesOnline = 0;
            let currentDatetime = dayjs();
            let currentDatetimeString = currentDatetime.toISOString();
            let timer = setInterval(async () => {
                let isVoice = newState.member.voice.channelId !== null;
                if (isVoice) {
                    minutesOnline += 1;
                } else {
                    clearInterval(timer);
                    // compute coins and provide to player
                    let rewards = Math.floor(minutesOnline / 2);
                    await prisma.player.upsert({
                        where: {
                            id: newState.member.id,
                        },
                        update: {
                            wallet: {
                                increment: rewards,
                            },
                        },
                        create: {
                            id: newState.member.id,
                            wallet: 0,
                            lastWorked: currentDatetimeString,
                        },
                    });
                    await shoplog({
                        title: `User in VC`,
                        color: `Green`,
                        description: `${userMention(newState.member.id)} was in #${channelName} for ${minutesOnline} minutes and earned ${rewards} ${
                            emojis.coin
                        }`,
                    });
                }
            }, CHECK_INTERVAL);
        }

        if (oldState.channelId !== null && newState.channelId == null) {
            console.log(`${newState.member.user.tag} left vc in #${oldState.channel.name}`);
        }
    },
};
