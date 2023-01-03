const Util = require('../util')
const config = require('../config.json')

module.exports = {
    data: {
        name: "pomodoro",
        description: "Pomodoro tekniği ile çalışma rutini sağlar.",
        options: [
            {
                type: 3,
                name: "islem",
                description: "Hangi işlemi yapmak istiyorsun?",
                required: true,
                choices: [
                    {
                        name: "Başlat",
                        value: "baslat"
                    },
                    {
                        name: "Durdur",
                        value: "durdur"
                    },
                ]
            }
        ]
    },
    execute(interaction) {
        const operation = interaction.options.getString('islem')
        const member = interaction.member

        switch (operation) {
            case "baslat":
                if (config.pomodoro.includes(member.id)) {
                    interaction.reply({
                        content: `Zaten pomodoro listesindesin. ${Util.emoji('LN_pepewtf', interaction.client)}`,
                        allowedMentions: {repliedUser: true},
                        ephemeral: true
                    })
                }
                else {
                    config.pomodoro.push(member.id)
                    interaction.reply({
                        content: `Pomodoro listesine eklendin. Çalışma zamanı! ${Util.emoji('LN_letsfuckinggo', interaction.client)}
                        Seninle birlikte çalışan ${config.pomodoro.length} kişi var.`,
                        allowedMentions: {repliedUser: true},
                    })
                }
                break

            case "durdur":
                if (config.pomodoro.includes(member.id)) {
                    interaction.reply({
                        content: `Zaten pomodoro listesinde değilsin. ${Util.emoji('LN_pepewtf', interaction.client)}`,
                        allowedMentions: {repliedUser: true},
                        ephemeral: true
                    })
                }
                else {
                    config.pomodoro = config.pomodoro.filter(e => e !== member.id);
                    interaction.reply({
                        content: `Pomodoro listesinden çıkarıldın.`,
                        allowedMentions: {repliedUser: true},
                    })
                }
        }
    }
}