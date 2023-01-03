const members = require('../members.json')
const Util = require('../util')
const Discord = require('discord.js')

module.exports = {
    data: {
        name: "günlük",
        description: "Günlük LP hakkınızı almanızı veya hediye etmenizi sağlar.",
        options: [
            {
                type: 6,
                name: "kullanıcı",
                description: "Günlük LP hakkını kime hediye etmek istiyorsun?",
                required: false
            }
        ]
    },
    async execute(interaction) {
        if (interaction.member.id === '429269659582201856' || interaction.member.id === '367357400694521866') {
            interaction.reply({content: '¯\\_(ツ)_/¯', allowedMentions: {repliedUser: true}})
            return
        }

        let user = interaction.options.getUser('kullanıcı')
        if (!user) user = interaction.member

        const id = user.id

        if (user.bot) {
            interaction.reply({content: `Bu bir bot. ${Util.emoji('LN_Pepestare', interaction.guild)}`})
            return
        }

        const memberObject = Util.getMember(id)
        const memberObjectSelf = Util.getMember(interaction.member.id)

        if (!memberObjectSelf.daily) {
            const embed = new Discord.MessageEmbed()
                .setColor('#b752b7')
                .setTitle(`Bugünkü hakkını zaten kullandın!`)
                .setDescription(`> Günlük 100${Util.emoji('LP_small_spin', interaction.client)}
                    > hakkı her gün saat
                    > 00:00'da yenilenir.`)
                .setThumbnail('https://cdn.discordapp.com/attachments/574221710811725824/872225465258115162/locked.gif')
            interaction.reply({content: `> ${interaction.member.toString()}`, embeds: [embed]})
            return
        }

        memberObjectSelf.daily = false
        memberObject.lp += 100
        if (memberObjectSelf.id === memberObject.id) {
            const embed = new Discord.MessageEmbed()
                .setColor('#b752b7')
                .setTitle(`Günlük LP hakkını aldın!`)
                .setDescription(`> Günlük 100${Util.emoji('LP_small_spin', interaction.client)}
                    > hakkını kullandın.`)
                .setThumbnail('https://media.discordapp.net/attachments/574221710811725824/872211432677195876/LP_stack.gif')
                .setFooter(`Toplam servetin ${memberObject.lp} LP oldu!`)
            interaction.reply({content: `> ${interaction.member.toString()}`, embeds: [embed]})
        } else {
            const random = Math.floor(Math.random() * 50) + 1
            memberObjectSelf.lp += random
            const embed = new Discord.MessageEmbed()
                .setColor('#b752b7')
                .setTitle(`${interaction.member.displayName} sana LP hediye etti!`)
                .setDescription(`> ${interaction.member.toString()}
                    > sana günlük 100${Util.emoji('LP_small_spin', interaction.client)}
                    > hakkını hediye etti!`)
                .setThumbnail('https://media.discordapp.net/attachments/574221710811725824/872203736511053905/gift2.gif')
                .setFooter(`${interaction.member.displayName} yardımseverlik ödülü olarak ${random} LP kazandı!`)
            interaction.reply({content: `> ${user.toString()}`, embeds: [embed]})
        }
        Util.saveFile('../members.json', members)
    }
}