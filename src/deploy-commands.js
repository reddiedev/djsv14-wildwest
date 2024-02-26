require(`dotenv`).config();
const { REST } = require(`@discordjs/rest`);
const { Routes } = require(`discord.js`);
const fs = require(`node:fs`);
const path = require(`node:path`);

const rest = new REST({ version: `10` }).setToken(process.env.TOKEN);

const commands = [];
const commandsPath = path.join(__dirname, `commands`);
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(`.js`));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}
rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.guildID), {
    body: commands,
})
    .then(() => console.log(`Successfully registered application commands.`))
    .catch(console.error);
