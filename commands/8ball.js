const {MessageEmbed, MessageAttachment} = require('discord.js')
const talkedRecently = new Set()

module.exports = {
    data: {
        name: '8top',
        description: 'Gizemli top sorularınızı yanıtlar.',
        options: [
            {
                name: 'soru',
                description: 'Sormak istediğiniz soru nedir?',
                type: 3,
                required: true
            }
        ]
    },
    execute(interaction) {
        if (interaction.member.id === '429269659582201856' || interaction.member.id === '367357400694521866') {
            interaction.reply({content: '¯\\_(ツ)_/¯', allowedMentions: {repliedUser: true}})
            return
        }

        const question = interaction.options.getString('soru')
        const answers = [
            'Kesinlikle.',
            'Muhakkak.',
            'Şüphesiz.',
            'Evet, elbette.',
            'Kuşkusuz.',
            'Bunun doğru olduğuna inanabilirsin.',
            'Göründüğü kadarıyla, evet.',
            'Büyük ihtimalle.',
            'Yüksek ihtimalle.',
            'Evet.',
            'Hislerim doğru olduğunu gösteriyor.',
            'Tam emin olamadım, tekrar dene.',
            'Emin olamadım, daha sonra tekrar sor.',
            'Söylemesem daha iyi.',
            'Şu an pek kestiremiyorum.',
            'Konsantre ol ve tekrar sor.',
            'Sanmıyorum.',
            'Hayır.',
            'Kuşlar bana hayır dedi.',
            'Güvenilir bir kaynak bana hayır dedi.',
            'Göründüğü kadarıyla, hayır.',
            'Hiç sanmıyorum.'
        ]
        const answer = answers[Math.floor(Math.random() * answers.length)]
        const attachment = new MessageAttachment('/root/legionary/images/8ball.png')

        if (talkedRecently.has(interaction.member.id)) {
            interaction.reply({
                content: 'Bu komut dakikada bir kullanılabilir. Geleceği alaya alma. ಠ_ಠ',
                ephemeral: true,
                allowedMentions: {repliedUser: true}
            })
        } else {
            const embed = new MessageEmbed()
                .setThumbnail('attachment://8ball.png')
                .setAuthor(`${interaction.user.username} Kullanısının 8Top Sonucu:`, interaction.user.displayAvatarURL({dynamic: true}))
                .setTitle(answer)
                .setColor('#b752b7')
                .setDescription(question)
            interaction.reply({embeds: [embed], files: [attachment]})

            talkedRecently.add(interaction.member.id)
            setTimeout(() => {
                talkedRecently.delete(interaction.member.id)
            }, 60000)
        }
    }
}