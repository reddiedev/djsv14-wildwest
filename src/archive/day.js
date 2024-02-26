const { SlashCommandBuilder } = require(`discord.js`);
const Rcon = require(`rcon`);
require(`dotenv`).config();

const rconClient = new Rcon(`206.217.202.79`, `48003`, `AlkSmells1`);
const COMMAND = `Settimeofday 7:00`;

module.exports = {
    data: new SlashCommandBuilder().setName(`day`).setDescription(`set world to day time`),
    async execute(interaction) {
        await interaction.reply(`Pong!`);

        rconClient
            .on(`auth`, async function () {
                console.log(`Authenticated`);
                console.log(`Sending command: ${COMMAND}`);
                rconClient.send(`${COMMAND}`);
                console.log(`Done Sending command: ${COMMAND}`);
            })
            .on(`response`, function (str) {
                console.log(`Response: ` + str);
            })
            .on(`error`, function (err) {
                console.log(`Error: ` + err);
            })
            .on(`end`, function () {
                console.log(`Connection closed`);
            });
        console.log(`starting connect`);
        rconClient.connect();
        console.log(`done connect`);
    },
};
