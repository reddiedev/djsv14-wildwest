async function closeTicket(interaction) {
    return new Promise(async (resolve) => {
        try {
            await interaction.deferUpdate();
            await interaction.channel.send(`Close ticket command received. This channel will be deleted in a few seconds`);
            setTimeout(async () => {
                await interaction.channel.delete();
            }, 5 * 1000);
        } catch (err) {
            console.log(err);
        }

        resolve();
    });
}
module.exports = closeTicket;
