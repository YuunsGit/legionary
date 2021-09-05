const {MessageEmbed} = require('discord.js')
const config = require('../config.json')
const logs = require('../logs.json')
const cron = require('node-cron')
const Util = require('../util')
const fetch = require("node-fetch");

module.exports = client => {
    const emoji = name => {
        return client.emojis.cache.find(emoji => emoji.name === name)
    }

    const dailyNight = new cron.schedule("00 15 19 * * *", async () => {
        const channel = client.channels.cache.get('419963388941172739')//419963388941172739
        const length = logs.daily.length

        let today = length>0 ? '' : `\nKayda değer bir şey yaşanmamış gibi ${emoji("ln_peperain")}`
        for (const one of logs.daily) {
            today = `${today}\n• ${one.log}`
        }
        if (length > 3 && length < 8) {
            today = `${today}\n__Verimli bir gündü, umarım eğlenmişsinizdir ${emoji("ln_pepeok")}__`
        } else if (length >= 8) {
            today = `${today}\n__Vay canına, cidden dolu dolu bir gündü ${emoji("ln_pepeheart2")}__`
        }

        const d = new Date()
        const day = d.getUTCDate()<10 ? ("0" + d.getUTCDate()) : d.getUTCDate()
        const month = (d.getUTCMonth() + 1)<10 ? ("0" + (d.getUTCMonth() + 1)) : (d.getUTCMonth() + 1)
        const date = day + '/' + month + '/' + d.getUTCFullYear()
        const dataObj = await fetch('https://raw.githubusercontent.com/ozanerturk/covid19-turkey-api/master/dataset/timeline.json').then(res => res.json()).then(out => {
            return out[date]
        })

        const formatter = new Intl.NumberFormat()

        const coronaData = {
            "tests": 0,
            "cases": 0,
            "deaths": 0
        }
        for (const one of ["tests", "cases", "deaths"]) {
            const data = formatter.format(dataObj[one]).replace(',', '.')
            coronaData[one] = parseInt(dataObj[one]) < parseInt(config.corona[one]) ?
                data + emoji('decrease').toString() :
                data + emoji('increase').toString()
        }

        const embed = new MessageEmbed()
            .setTitle("İyi Akşamlar Legion! :night_with_stars:")
            .setAuthor("Günlük Duyuru:", channel.guild.iconURL({dynamic: true}))
            .setURL("https://tr.wikipedia.org/wiki/Vikipedi:Tarihte_bug%C3%BCn")
            .setColor("#b752b7")
            .setDescription(`${emoji("LN_pinned")} Bugün Legion'da tam **__${config.messages}__** adet mesaj atıldı.`)
            .addFields(
                {
                    inline: false,
                    name: "Bugün Legion'da başka neler yaşandı?",
                    value: `${today}`
                },
                {
                    inline: false,
                    name: "Günlük Corona Verileri:",
                    value: `Bu veriler Sağlık Bakanlığından alınmıştır.`
                },
                {
                    inline: true,
                    name: "Test sayısı",
                    value: coronaData.tests
                },
                {
                    inline: true,
                    name: "Vaka sayısı",
                    value: coronaData.cases
                },
                {
                    inline: true,
                    name: "Ölüm sayısı",
                    value: coronaData.deaths
                },
                {
                    inline: false,
                    name: "Spotify Akşam Müziği: :musical_note:",
                    value: "[Keyfini çıkar](https://open.spotify.com/playlist/37i9dQZF1DXcWBRiUaG3o5)"
                },
                {
                    inline: false,
                    name: "Akşam Haberleri: :newspaper:",
                    value: "[Ne olmuş bitmiş?](https://news.google.com/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNREY2Ym1OZkVnSjBjaWdBUAE?hl=tr&gl=TR&ceid=TR%3Atr)"
                }
            )
            .setFooter("Ekran başından uzaklaşırken /ben komudunu kullanabilirsin.", "https://i.imgur.com/5g9IJAq.png")
            .setThumbnail("https://i.imgur.com/Uu3Ewir.gif")
        channel.send({embeds: [embed]})

        logs.daily = []
        Util.saveFile('/root/legionary/logs.json', logs)

        config.messages = 0
        config.corona = dataObj
        Util.saveFile('/root/legionary/config.json', config)
    }, {})
    dailyNight.start()
}