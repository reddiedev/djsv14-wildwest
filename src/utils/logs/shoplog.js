const { EmbedBuilder, WebhookClient } = require(`discord.js`);
const trimString = require(`../helpers/trimString`);

async function shoplog(payload) {
    return new Promise(async (resolve, reject) => {
        try {
            const webhookClient = new WebhookClient({ url: process.env.SHOPLOGS_WEBHOOK_URL });
            let trimmedDescription = trimString(payload.description, 4000);
            let embed = new EmbedBuilder()
                .setTitle(payload.title)
                .setDescription(trimmedDescription)
                .setColor(payload.color ? payload.color : `Random`);
            await webhookClient.send({ embeds: [embed] });
            resolve();
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}

module.exports = shoplog;
