const addMessagePoints = require(`../utils/messages/addMessagePoints`);
const processLogout = require(`../utils/messages/processLogout`);

module.exports = {
    name: `messageCreate`,
    async execute(message) {
        try {
            console.log(`${message.author.tag} sent a message in #${message.channel.name}`);

            if (message.author.bot) {
                if (message.channelId == process.env.gameLogsChannelID && message.cleanContent.startsWith(`Logout;`)) {
                    await processLogout(message);
                    return;
                } else {
                    return;
                }
            }
            await addMessagePoints(message);
        } catch (err) {
            console.log(err);
        }
    },
};
