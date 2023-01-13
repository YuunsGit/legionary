const { EmbedBuilder } = require("discord.js");
const config = require("../schemas/config");
const logs = require("../schemas/log");
const cron = require("node-cron");

module.exports = (client) => {
    const emoji = (name) => {
        return client.emojis.cache.find((emoji) => emoji.name === name);
    };

    const dailyNight = new cron.schedule(
        "00 00 19 * * *",
        async () => {
            const channel = client.channels.cache.get("419963388941172739");
            /*const length = logs.daily.length;

            let today = length > 0 ? "" : `\nKayda değer bir şey yaşanmamış gibi ${emoji("ln_Depression")}`;
            for (const one of logs.daily) {
                today = `${today}\n• ${one.log}`;
            }
            if (length > 3 && length < 8) {
                today = `${today}\n__Verimli bir gündü, umarım eğlenmişsinizdir ${emoji("ln_pepeok")}__`;
            } else if (length >= 8) {
                today = `${today}\n__Vay canına, cidden dolu dolu bir gündü ${emoji("ln_pepeheart2")}__`;
            }*/

            const messageCount = await config.findOne().then((configObject) => {
                return configObject.messages;
            });

            const embed = new EmbedBuilder()
                .setTitle("İyi Akşamlar Legion! :night_with_stars:")
                .setAuthor({
                    name: "Günlük Duyuru:",
                    iconURL: channel.guild.iconURL({ dynamic: true }),
                })
                .setURL("https://tr.wikipedia.org/wiki/Vikipedi:Tarihte_bug%C3%BCn")
                .setColor("#b752b7")
                .setDescription(`${emoji("LN_pinned")} Bugün Legion'da tam **__${messageCount}__** adet mesaj atıldı.`)
                .addFields(
                    {
                        inline: false,
                        name: "Bugün Legion'da başka neler yaşandı?",
                        value: `\nKayda değer bir şey yaşanmamış gibi ${emoji("ln_Depression")}`,
                    },
                    {
                        inline: false,
                        name: "Spotify Akşam Müziği: :musical_note:",
                        value: "[Keyfini çıkar](https://open.spotify.com/playlist/37i9dQZF1DXcWBRiUaG3o5)",
                    },
                    {
                        inline: false,
                        name: "Akşam Haberleri: :newspaper:",
                        value: "[Ne olmuş bitmiş?](https://news.google.com/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNREY2Ym1OZkVnSjBjaWdBUAE?hl=tr&gl=TR&ceid=TR%3Atr)",
                    }
                )
                .setFooter({
                    text: "Ekran başından uzaklaşırken /ben komudunu kullanabilirsin.",
                    iconURL: "https://i.imgur.com/5g9IJAq.png",
                })
                .setThumbnail("https://i.imgur.com/Uu3Ewir.gif");
            channel.send({ embeds: [embed] });

            // LOG RESET

            config.findOne().then((configObject) => {
                configObject.messages = 0;
                configObject.save();
            });
        },
        {}
    );
    dailyNight.start();
};
