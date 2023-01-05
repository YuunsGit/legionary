const { translate } = require("bing-translate-api");

module.exports = {
    data: {
        name: "İngilizce'ye çevir",
        type: 3,
    },
    async execute(interaction) {
        if (interaction.member.id === "429269659582201856" || interaction.member.id === "367357400694521866") {
            interaction.reply({ content: "¯\\_(ツ)_/¯", allowedMentions: { repliedUser: true } });
            return;
        }

        translate(
            await interaction.channel.messages.fetch(interaction.targetId).then((res) => {
                return res.content;
            }),
            "auto-detect",
            "en",
            false,
            false,
            "user-agent"
        )
            .then((res) => {
                interaction.reply({ content: ":flag_us: **İngilizcesi:** " + res.translation, ephemeral: true });
            })
            .catch((err) => {
                console.error(err);
            });
    },
};
