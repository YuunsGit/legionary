const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: {
        name: "çevir",
        description: "İngilizce-Türkçe veya Türkçe-İngilizce çeviri yapabilmenizi sağlar.",
        options: [
            {
                name: "kelime",
                description: "Anlamını öğrenmek istediğiniz Türkçe veya İngilizce kelime nedir?",
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

        return;

        const word = interaction.options.getString("kelime");
        const wordObj = await fetch(encodeURI(`http://tureng.herokuapp.com/translate?phrase=${word}`))
            .then((res) => res.json())
            .then((out) => {
                return out;
            });

        if (!wordObj) {
            interaction.reply({ content: "Böyle bir kelime mevcut değil." });
            return;
        }

        const phrases = wordObj.phrases.length > 10 ? wordObj.phrases.slice(0, 10) : wordObj.phrases;

        let desc = "";
        for (const one of phrases) {
            desc = `${desc}\n**${one.category}.** ${one.target}`;
        }

        if (wordObj.phrases.length > 10)
            desc = `${desc}\n[... ${wordObj.phrases.length - 10} sonuç daha](${encodeURI(
                `https://tureng.com/tr/turkce-ingilizce/${word}`
            )})`;

        const embed = new MessageEmbed()
            .setThumbnail("https://i.imgur.com/XpVCpWc.png")
            .setTitle(`${word.toLowerCase()}:`)
            .setDescription(desc)
            .setColor("#b752b7")
            .setFooter(`${wordObj.count} adet sonuç bulundu.`);

        interaction.reply({ embeds: [embed] });
    },
};
