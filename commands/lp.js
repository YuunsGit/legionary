const members = require('../members.json')
const Util = require('../util')
const {MessageEmbed, Permissions} = require('discord.js')

module.exports = {
    data: {
        name: "lp",
        description: "Kullanıcıların Legion Puanları ile işlem yapabilmelerini sağlar.",
        options: [
            {
                type: 3,
                name: "işlem",
                description: "Hangi işlemi yapmak istiyorsun?",
                required: true,
                choices: [
                    {
                        name: "Yolla",
                        value: "yolla"
                    },
                    {
                        name: "Ekle (Admin)",
                        value: "ekle"
                    },
                    {
                        name: "Sil (Admin)",
                        value: "sil"
                    }
                ]
            },
            {
                type: 6,
                name: "kullanıcı",
                description: "Kime Legion Puanı yollamak istiyorsun?",
                required: true
            },
            {
                type: 4,
                name: "miktar",
                description: "Ne kadar Legion Puanı yollamak istiyorsun?",
                required: true
            }
        ]
    },
    execute(interaction) {
        if (interaction.member.id === '429269659582201856' || interaction.member.id === '367357400694521866') {
            interaction.reply({content: '¯\\_(ツ)_/¯', allowedMentions: {repliedUser: true}})
            return
        }

        const id = interaction.options.getUser('kullanıcı').id
        const action = interaction.options.getString('işlem')
        const count = interaction.options.getInteger('miktar')

        if (interaction.options.getUser('kullanıcı').bot) {
            interaction.reply({content: `Bu bir bot. ${Util.emoji('LN_Pepestare', interaction.guild)}`})
            return
        }

        if (['ekle', 'sil'].includes(action) && !interaction.guild.members.cache.get(interaction.member.id).permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            interaction.reply({content: '¯\\_(ツ)_/¯', allowedMentions: {repliedUser: true}})
            return
        }

        if (interaction.member.id === id) {
            interaction.reply({content: 'https://i.imgur.com/RelDztn.jpg'})
            return
        }

        const memberObjectSelf = Util.getMember(interaction.member.id)
        const memberObject = Util.getMember(id)

        switch (action) {
            case "ekle":
                memberObject.lp += count
                interaction.reply({content: `**${count}${Util.emoji('LP_small_spin', interaction.client)}** kullanıcı hesabına eklendi.`})
                break
            case "sil":
                memberObject.lp -= count
                interaction.reply({content: `**${count}${Util.emoji('LP_small_spin', interaction.client)}** kullanıcı hesabından silindi.`})
                break
            case "yolla":
                if (memberObjectSelf.lp < count) {
                    interaction.reply({content: `Hesabında **${count}${Util.emoji('LP_small_spin', interaction.client)}** bulunmuyor.`})
                    return
                }
                memberObjectSelf.lp -= count
                memberObject.lp += Math.ceil(count * 4 / 5)
                const embed = new MessageEmbed()
                    .setColor('#b752b7')
                    .setTitle(`${interaction.member.displayName} sana LP yolladı!`)
                    .setDescription(`> **Gönderen: ${interaction.member.toString()}** 
                    > **Alıcı: ${interaction.options.getUser('kullanıcı').toString()}**
                    > **Miktar: ${Math.ceil(count * 4 / 5)}${Util.emoji('LP_small_spin', interaction.client)}**`)
                    .setThumbnail('https://media.discordapp.net/attachments/574221710811725824/872064641830912020/image0.gif')
                    .setFooter(`Yere ise ${Math.floor(count / 5)} LP düşmüş. ¯\\_(ツ)_/¯`)
                interaction.reply({content: `> ${interaction.options.getUser('kullanıcı').toString()}`, embeds: [embed]})
        }

        Util.saveFile('/root/legionary/members.json', members)
    }
}