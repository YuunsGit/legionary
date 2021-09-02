const config = require('../config.json')
const Util = require('../util')

module.exports = {
    data: {
        name: "durum",
        description: "Botun anlık durumunu değiştirir.",
        default_permission: false,
        options: [
            {
                type: 3,
                name: "durum",
                description: "Ayarlanacak durumun açıklaması nedir?",
                required: true
            },
            {
                type: 4,
                name: "türü",
                description: "Ayarlanacak durumun türü nedir?",
                required: true,
                choices: [
                    {
                        name: "Oynuyor",
                        value: 0
                    },
                    {
                        name: "Yayınlıyor",
                        value: 1
                    },
                    {
                        name: "Dinliyor",
                        value: 2
                    },
                    {
                        name: "İzliyor",
                        value: 3
                    },
                    {
                        name: "Custom",
                        value: 4
                    },
                    {
                        name: "Yarışıyor",
                        value: 5
                    }
                ]
            }
        ]
    },
    perms: [
        {
            id: '305044214239068162',
            type: 'USER',
            permission: true
        }
    ],
    async execute(interaction) {
        const status = interaction.options.getString('durum')
        const type = interaction.options.getInteger('türü')

        await interaction.client.user.setPresence({
            activities: [{
                name: status,
                type: type
            }]
        })

        config.status = {
            name: status,
            type: type
        }

        await Util.saveFile('/root/legionary/config.json', config)
        interaction.reply(`Durum başarıyla güncellendi. ${Util.emoji('ln_pepeok', interaction.client)}`)
    }
}