const {MessageEmbed, MessageAttachment} = require('discord.js')
const Util = require('../util')

module.exports = {
    data: {
        name: "öneri",
        description: "Sunucu yararına önerilerde bulunabilmeni sağlar.",
        options: [
            {
                type: 3,
                name: "türü",
                description: "Hangi türde bir öneri yapmak istersin?",
                required: true,
                choices: [
                    {
                        name: "Genel öneri",
                        value: "513656451475046421"
                    },
                    {
                        name: "He-Man önerisi",
                        value: "877160655071871038"
                    }
                ]
            },
            {
                type: 3,
                name: "öneri",
                description: "Nasıl bir öneride bulunmak istiyorsun? Kısa ve öz bir şekilde anlat lütfen.",
                required: true
            }
        ]
    },
    execute(interaction) {
        if (interaction.member.id === '429269659582201856' || interaction.member.id === '367357400694521866') {
            interaction.reply({content: '¯\\_(ツ)_/¯', allowedMentions: {repliedUser: true}})
            return
        }

        const suggestion = interaction.options.getString('öneri')
        const suggestionChannel = interaction.guild.channels.cache.get(interaction.options.getString('türü'))
        const idea = new MessageAttachment('../images/idea.gif', 'idea.gif')

        const embed = new MessageEmbed()
            .setTitle("Yeni öneri: :paperclip:")
            .setAuthor(interaction.user.username.toString(), interaction.user.displayAvatarURL({dynamic: true}))
            .setColor("#b752b7")
            .setDescription(Util.capitalize(suggestion))
            .setThumbnail("attachment://idea.gif")
        suggestionChannel.send({embeds: [embed], files: [idea]}).then(message => Util.addReactions(message, ['⬆', '⬇']))

        interaction.reply({
            content: 'Önerin ' + suggestionChannel.toString() + ' kanalında yayınlandı.' +
                ' Yeteri kadar desteklenirse yetkililer tarafından uygulanacak.'
        })
    }
}