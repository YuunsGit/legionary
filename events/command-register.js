module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isCommand() && !interaction.isContextMenu()) return;

        const { commandName } = interaction;

        if (!interaction.client.commands.has(commandName)) return;

        try {
            await interaction.client.commands.get(commandName).execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content:
                    "Komudu çalıştırmaya çalışırken bir hata meydana geldi! Bu mesajı görüyorsan bir yetkiliye bildir.",
                ephemeral: true,
            });
        }
    },
};
