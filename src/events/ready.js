const chalk = require(`chalk`);
const { ActivityType } = require(`discord-api-types/v10`);
let status = require(`../../status`);
const dayjs = require(`../utils/datetime/dayjs-setup`);
module.exports = {
    name: `ready`,
    once: true,
    async execute(client) {
        console.log(chalk.green(`Ready!`) + ` Logged in as ` + chalk.blueBright(client.user.tag));
        console.log(`Current online at ` + chalk.magenta(client.guilds.cache.size) + ` servers`);

        // sets the bot activity
        await client.user.setActivity({
            name: `Beasts of Bermuda`,
            type: ActivityType.Playing,
        });

        //sets the bot profile picture
        // await client.user
        //     .setAvatar(`src/media/logo.png`)
        //     .then(() => console.log(`New avatar set!`))
        //     .catch(console.error);

        // reset the shop and time
        let currentTime = dayjs();
        let prevTime = currentTime.subtract(2, `hour`);
        status.lastStorm = prevTime;
        status.lastTime = prevTime;
    },
};
