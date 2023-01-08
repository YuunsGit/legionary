const { MessageEmbed } = require("discord.js");
const cron = require("node-cron");
const fetch = require("node-fetch");

module.exports = (client) => {
    const dailyMorning = new cron.schedule(
        "00 00 06 * * *",
        async () => {
            const channel = client.channels.cache.get("419963388941172739");

            let usdValue, euroValue;
            await fetch("http://data.fixer.io/api/latest?access_key=05d238cf8d20389129e8e5db4d79c71a&format=1")
                .then((res) => res.json())
                .then((out) => {
                    usdValue = out.rates.TRY / out.rates.USD;
                    euroValue = out.rates.TRY;
                })
                .catch((err) => console.log(err));

            const ankaraWeather = await fetch(
                "https://api.openweathermap.org/data/2.5/weather?lat=39.92&lon=32.85&lang=tr&units=metric&appid=" +
                    process.env.WEATHER_TOKEN
            ).then((res) => res.json());
            const ankara =
                ankaraWeather.weather[0].description.charAt(0).toUpperCase() +
                ankaraWeather.weather[0].description.slice(1) +
                ", " +
                Math.trunc(ankaraWeather.main.temp) +
                "°C, %" +
                ankaraWeather.main.humidity +
                " nemli";

            const istanbulWeather = await fetch(
                "https://api.openweathermap.org/data/2.5/weather?lat=41.00&lon=28.96&lang=tr&units=metric&appid=" +
                    process.env.WEATHER_TOKEN
            ).then((res) => res.json());
            const istanbul =
                istanbulWeather.weather[0].description.charAt(0).toUpperCase() +
                istanbulWeather.weather[0].description.slice(1) +
                ", " +
                Math.trunc(istanbulWeather.main.temp) +
                "°C, %" +
                istanbulWeather.main.humidity +
                " nemli";

            const embed = new MessageEmbed()
                .setTitle("Günaydın Legion! :city_sunset:")
                .setAuthor({
                    name: "Günlük Duyuru:",
                    iconURL: channel.guild.iconURL({ dynamic: true }),
                })
                .setURL("https://tr.wikipedia.org/wiki/Vikipedi:Tarihte_bug%C3%BCn")
                .setColor("#b752b7")
                .setDescription(
                    "Dostum bu gün kim ve neden hep aydın? \n" +
                        "`  Legion Davet:  ` " +
                        client.emojis.cache.find((emoji) => emoji.name === "Legion").toString() +
                        "  https://discord.gg/dHnZFVX\n"
                )
                .setFooter({
                    text: "Ekran başından uzaklaşırken /ben komudunu kullanabilirsin.",
                    iconURL: "https://i.imgur.com/5g9IJAq.png",
                })
                .addFields(
                    {
                        inline: true,
                        name: "Bir Euro Kaç Lira: :euro:",
                        value: Number(euroValue).toFixed(2).replace(".", ",") + " ₺",
                    },
                    {
                        inline: true,
                        name: "Bir Dolar Kaç Lira: :dollar:",
                        value: Number(usdValue).toFixed(2).replace(".", ",") + " ₺",
                    },
                    {
                        inline: false,
                        name: "Spotify Sabah Müziği: :musical_note:",
                        value: "[Keyfini çıkar](https://open.spotify.com/playlist/37i9dQZF1DXb5Mq0JeBbIw)",
                    },
                    {
                        inline: true,
                        name: "Ankara'da Hava: :thermometer: ",
                        value: ankara,
                    },
                    {
                        inline: true,
                        name: "İstanbul'da Hava: :thermometer: ",
                        value: istanbul,
                    },
                    {
                        inline: false,
                        name: "Steam İndirimleri: :video_game:",
                        value: "[Steam'i ziyaret et](https://store.steampowered.com/specials)",
                    }
                )
                .setThumbnail("https://i.imgur.com/MYm3dZR.gif");

            channel.send({ embeds: [embed] });
        },
        {}
    );

    dailyMorning.start();
};
