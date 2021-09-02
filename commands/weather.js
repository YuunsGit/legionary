const weather = require('openweather-apis')
const Util = require('../util')

module.exports = {
    data: {
        name: "hava",
        description: "Anlık hava durumunu öğrenebilmenizi sağlar.",
        options: [
            {
                type: 3,
                name: "şehir",
                description: "Hangi şehirdeki hava durumundan haberdar olmak istiyorsun?",
                required: true
            }
        ]
    },
    async execute(interaction) {
        if (interaction.member.id === '429269659582201856' || interaction.member.id === '367357400694521866') {
            interaction.reply({content: '¯\\_(ツ)_/¯', allowedMentions: {repliedUser: true}})
            return
        }

        if (interaction.channel.id === '419963388941172739') {
            interaction.reply({content: `O komudun yeri burası değil, yallah ${interaction.guild.channels.cache.get('459189010649055242').toString()} kanalına.`})
            return
        }

        const city = interaction.options.getString('şehir')
        weather.setLang('tr')
        weather.setCity(city.replace('İ', 'I'))
        weather.setAPPID('04d0539a8e1c75cda50c2dc05990532d')
        await weather.getSmartJSON((err, all) => {
            if(err) {
                interaction.reply({content: 'Geçerli bir şehir girmelisin.', ephemeral: true})
                return
            }
            interaction.reply({content: city + ' şehrinde hava; ' + Util.capitalize(all.description) + ', ' + Math.trunc(all.temp) + '°C, %' + all.humidity + ' nemli', allowedMentions: {repliedUser: true}})
        })
    }
}
