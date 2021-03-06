const {MessageEmbed} = require('discord.js')
const cron = require('node-cron')
const fetch = require('node-fetch')
const weather = require('openweather-apis')

module.exports = client => {
    let ankara = '?'
    weather.setLang('tr')
    weather.setCity('Ankara')
    weather.setAPPID('04d0539a8e1c75cda50c2dc05990532d')
    weather.getSmartJSON((err, all) => {
        if (err) console.log(err);
        ankara = all.description.charAt(0).toUpperCase() + all.description.slice(1) + ', ' + Math.trunc(all.temp) + '°C, %' + all.humidity + ' nemli'
    })

    let istanbul = '?'
    weather.setCity('Istanbul')
    weather.getSmartJSON((err, all) => {
        if (err) console.log(err);
        istanbul = all.description.charAt(0).toUpperCase() + all.description.slice(1) + ', ' + Math.trunc(all.temp) + '°C, %' + all.humidity + ' nemli'
    })

    let usdValue, euroValue
    fetch('http://data.fixer.io/api/latest?access_key=05d238cf8d20389129e8e5db4d79c71a&format=1').then(res => res.json()).then(out => {
        usdValue = out.rates.TRY/out.rates.USD
        euroValue = out.rates.TRY
    }).catch(err => console.log(err))

    const dailyMorning = new cron.schedule("00 00 06 * * *", () => {
        const channel = client.channels.cache.get('419963388941172739')
        const embed = new MessageEmbed()
            .setTitle("Günaydın Legion! :city_sunset:")
            .setAuthor("Günlük Duyuru:", channel.guild.iconURL({dynamic: true}))
            .setURL("https://tr.wikipedia.org/wiki/Vikipedi:Tarihte_bug%C3%BCn")
            .setColor("#b752b7")
            .setDescription("`  Legion Steam:  ` " + client.emojis.cache.find(emoji => emoji.name === 'ln_steam').toString() +
                "  https://s.team/chat/ZzztpBkv\n`  Legion Davet:  ` " + client.emojis.cache.find(emoji => emoji.name === 'Legion').toString() + "  https://discord.gg/dHnZFVX\n")
            .setFooter("Ekran başından uzaklaşırken /ben komudunu kullanabilirsin.", "https://i.imgur.com/5g9IJAq.png")
            .addFields(
                {
                    inline: true,
                    name: "Bir Euro Kaç Lira: :euro:",
                    value: Number(euroValue).toFixed(2).replace('.', ',') + " ₺"
                },
                {
                    inline: true,
                    name: "Bir Dolar Kaç Lira: :dollar:",
                    value: Number(usdValue).toFixed(2).replace('.', ',') + " ₺"
                },
                {
                    inline: false,
                    name: "Spotify Sabah Müziği: :musical_note:",
                    value: "https://open.spotify.com/playlist/37i9dQZF1DXb5Mq0JeBbIw"
                },
                {
                    inline: true,
                    name: "Ankara'da Hava: :thermometer: ",
                    value: ankara
                },
                {
                    inline: true,
                    name: "İstanbul'da Hava: :thermometer: ",
                    value: istanbul
                },
                {
                    inline: false,
                    name: "Steam İndirimleri: :video_game:",
                    value: "https://store.steampowered.com/specials"
                },
            )
            .setThumbnail("https://i.imgur.com/MYm3dZR.gif")
        channel.send({embeds: [embed]})
    }, {})

    dailyMorning.start()
}