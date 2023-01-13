const fetch = require("node-fetch");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "sözlük",
        description: "Türkçe sözlüklerin TDK sözlüğündeki anlamlarını gösterir.",
        options: [
            {
                name: "kelime",
                description: "Anlamını öğrenmek istediğiniz kelime nedir?",
                type: 3,
                required: true,
            },
        ],
    },
    async execute(interaction) {
        if (interaction.member.id === "429269659582201856" || interaction.member.id === "367357400694521866") {
            interaction.reply({ content: "¯\\_(ツ)_/¯", allowedMentions: { repliedUser: true } });
            return;
        }

        const word = interaction.options.getString("kelime");
        const wordObj = await fetch("https://sozluk.gov.tr/gts?ara=" + word)
            .then((res) => res.json())
            .then((out) => {
                return out;
            });

        let desc = "";
        if (!wordObj[0]) {
            interaction.reply({ content: "TDK sözlüğünde böyle bir kelime mevcut değil." });
            return;
        }
        for (const one of wordObj[0].anlamlarListe) {
            desc = `${desc}\n**${one.anlam_sira}.** ${one.anlam}`;
        }

        const embed = new EmbedBuilder()
            .setThumbnail("https://i.imgur.com/PBO8ADv.png")
            .setTitle(`"${word}" kelimesinin anlamı:`)
            .setDescription(desc)
            .setColor("#b752b7")
            .setFooter({
                text: "Sözlük verileri resmi TDK sözlüğünden sağlanmaktadır.",
            });

        interaction.reply({ embeds: [embed] });
    },
};
