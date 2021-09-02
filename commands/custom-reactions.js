const Util = require('../util')
const reactions = require('../reactions.json')
const {MessageEmbed, MessageButton, MessageActionRow} = require('discord.js')

module.exports = {
    data: {
        name: "tepki",
        description: "Mesajlara verilen otomatik tepkileri düzenler.",
        default_permission: false,
        options: [
            {
                type: 3,
                name: "türü",
                description: "Hangi tepki türü üzerinde işlem yapılsın?",
                required: true,
                choices: [
                    {
                        name: "Yazım yanlışı",
                        value: "typo"
                    },
                    {
                        name: "Mizah",
                        value: "meme"
                    }
                ]
            },
            {
                type: 3,
                name: "işlem",
                description: "Hangi işlemi yapmak istiyorsun?",
                required: true,
                choices: [
                    {
                        name: "Listele",
                        value: "liste"
                    },
                    {
                        name: "Sil",
                        value: "sil"
                    },
                    {
                        name: "Ekle",
                        value: "ekle"
                    },
                    {
                        name: "Düzenle",
                        value: "düzenle"
                    }
                ]
            },
            {
                type: 3,
                name: "tetikleyici",
                description: "Tepkinin tetikleyicisi nedir? Tepki düzenlenecek veya silinecekse ID'si de yazılabilir.",
                required: false
            },
            {
                type: 3,
                name: "tepki",
                description: "İşlem yapılacak tepki nedir?",
                required: false
            }
        ]
    },
    perms: [
        {
            id: '876461729956126730',
            type: 'ROLE',
            permission: true
        }
    ],
    async execute(interaction) {
        const genre = interaction.options.getString('türü')
        const action = interaction.options.getString('işlem')
        const trigger = interaction.options.getString('tetikleyici')
        const reaction = interaction.options.getString('tepki')

        if (!interaction.member.roles.cache.has('876461729956126730')) {
            interaction.reply({
                content: `Bunu yapabilmek için gereken yetkiye sahip değilsin. ${Util.emoji('ln_pepezoom', interaction.client)}`,
                ephemeral: true,
                allowedMentions: {repliedUser: true}
            })
            return
        }

        switch (action) {
            case 'liste':
                if (reactions[genre].length <= 0) {
                    interaction.reply({
                        content: `Henüz hiç tepki eklenmemiş. ${Util.emoji('ln_pepezoom', interaction.client)}`,
                        allowedMentions: {repliedUser: true}
                    })
                    return
                }
                let list = ''
                let listPages = []
                const pageCount = Math.ceil(reactions[genre].length / 15)
                let x = 1
                for (const one of reactions[genre]) {
                    list = list + '\n` ' + one.id + ' ` ' + one.text
                    if (x % 15 === 0 || x === reactions[genre].length) {
                        const embed = new MessageEmbed()
                            .setTitle(Util.capitalize(genre) + ' Tepki Listesi:')
                            .setColor("#b752b7")
                            .setDescription(list)
                            .setFooter(Math.ceil(x / 15) + ' / ' + pageCount)
                            .setThumbnail('https://media.discordapp.net/attachments/769124445632987156/860102416250830868/Untitled_Artwork.png')
                        listPages.push(embed)
                        list = ''
                    }
                    x++
                }
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle('SUCCESS')
                            .setLabel('Önceki Sayfa')
                            .setCustomId('left'),
                        new MessageButton()
                            .setStyle('SUCCESS')
                            .setLabel('Sonraki Sayfa')
                            .setCustomId('right')
                    )
                const sentEmbed = await interaction.reply({
                    embeds: [listPages[0]],
                    components: [row],
                    fetchReply: true,
                    allowedMentions: {repliedUser: true}
                })
                const collector = await sentEmbed.createMessageComponentCollector({
                    componentType: 'BUTTON',
                    time: 60000
                })

                collector.on('collect', i => {
                    if (i.user.id === interaction.user.id) {
                        const page = parseInt(sentEmbed.embeds[0].footer.text.split(' ')[0]) - 1
                        switch (i.customId) {
                            case 'right':
                                if ((page + 1) > (listPages.length - 1)) {
                                    interaction.editReply({
                                        embeds: [listPages[0]],
                                        allowedMentions: {repliedUser: true}
                                    })
                                    break
                                }
                                interaction.editReply({
                                    embeds: [listPages[page + 1]],
                                    allowedMentions: {repliedUser: true}
                                })
                                break
                            case 'left':
                                if ((page - 1) < 0) {
                                    interaction.editReply({
                                        embeds: [listPages[listPages.length - 1]],
                                        allowedMentions: {repliedUser: true}
                                    })
                                    break
                                }
                                interaction.editReply({
                                    embeds: [listPages[page - 1]],
                                    allowedMentions: {repliedUser: true}
                                })
                        }
                    } else {
                        i.reply({
                            content: 'Bu sayfa senin için değil.',
                            ephemeral: true,
                            allowedMentions: {repliedUser: true}
                        })
                    }
                    i.deferUpdate()
                })
                break

            case 'sil':
                if (!trigger) {
                    interaction.reply({
                        content: `Silmek istediğin tepkinin tetikleyicisini veya ID\'sini girmelisin. ${Util.emoji('ln_pepezoom', interaction.client)}`,
                        ephemeral: true,
                        allowedMentions: {repliedUser: true}
                    })
                    return
                }
                let a = 0
                for (const one of reactions[genre]) {
                    if ([one.id, one.text].includes(trigger)) {
                        reactions[genre].splice(a, 1)
                        interaction.reply({
                            content: `Tepki silindi. ${Util.emoji('ln_pepeok', interaction.client)}`,
                            allowedMentions: {repliedUser: true}
                        })
                        Util.saveFile('/root/legionary/reactions.json', reactions)
                        return
                    }
                    a++
                }
                interaction.reply({
                    content: `Bu ID veya isme sahip bir tepki bulunamadı. ${Util.emoji('ln_pepezoom', interaction.client)}`,
                    allowedMentions: {repliedUser: true}
                })
                break

            case 'düzenle':
                if (!trigger || !reaction) {
                    interaction.reply({
                        content: `Düzenlemek istediğin tepkinin tetikleyicisini ve yeni tepkiyi girmelisin. ${Util.emoji('ln_pepezoom', interaction.client)}`,
                        ephemeral: true,
                        allowedMentions: {repliedUser: true}
                    })
                    return
                }
                for (const one of reactions[genre]) {
                    if ([one.id, one.text].includes(trigger)) {
                        one.reaction = reaction
                        interaction.reply({
                            content: `Tepki düzenlendi. ${Util.emoji('ln_pepeok', interaction.client)}`,
                            allowedMentions: {repliedUser: true}
                        })
                        return
                    }
                }
                interaction.reply({
                    content: `Bu ID veya isme sahip bir tepki bulunamadı. ${Util.emoji('ln_pepezoom', interaction.client)}`,
                    allowedMentions: {repliedUser: true}
                })
                break

            case 'ekle':
                if (!trigger || !reaction) {
                    interaction.reply({
                        content: `Eklemek istediğin tepkiyi ve tetikliyicisini girmelisin. ${Util.emoji('ln_pepezoom', interaction.client)}`,
                        ephemeral: true,
                        allowedMentions: {repliedUser: true}
                    })
                    return
                }
                for (const one of reactions[genre]) {
                    if ([one.text].includes(trigger)) {
                        interaction.reply({
                            content: `Zaten böyle bir tepki var. ${Util.emoji('ln_pepezoom', interaction.client)}`,
                            allowedMentions: {repliedUser: true}
                        })
                        return
                    }
                }
                const newReaction = {
                    "id": Util.generateID(),
                    "text": trigger.toString(),
                    "reaction": reaction.toString()
                }
                reactions[genre].push(newReaction)
                interaction.reply({
                    content: `Tepki listesi güncellendi. ${Util.emoji('ln_pepeok', interaction.client)}`,
                    allowedMentions: {repliedUser: true}
                })
        }

        Util.saveFile('/root/legionary/reactions.json', reactions)
    }
}

