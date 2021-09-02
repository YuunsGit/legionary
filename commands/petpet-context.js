const {MessageEmbed, MessageAttachment} = require('discord.js')
const petpet = require('pet-pet-gif')
const Util = require('../util')
const members = require('../members.json')

module.exports = {
    data: {
        name: 'Okşa',
        type: 2
    },
    async execute(interaction) {
        if (interaction.member.id === '429269659582201856' || interaction.member.id === '367357400694521866') {
            interaction.reply({content: '¯\\_(ツ)_/¯', allowedMentions: {repliedUser: true}})
            return
        }

        if (interaction.member.id === interaction.targetId && !interaction.channel.nsfw) {
            interaction.reply({
                content: `Kendini okşamak istiyorsan NSFW kanallarına gidebilirsin. ${Util.emoji('LN_wowowot', interaction.client)}`,
                allowedMentions: {repliedUser: true}
            })
            return
        }
        const user = await interaction.guild.members.fetch(interaction.targetId)
        let gif = await petpet(user.user.displayAvatarURL({format: "png"}), {delay: 30})
        const attachment = new MessageAttachment(gif, 'pet.gif')

        const embed = new MessageEmbed()
            .setColor("#b752b7")
            .setTitle("Okşandın!")
            .setDescription('Okşayan: ' + interaction.member.toString())
            .setImage("attachment://pet.gif")
        await interaction.reply({content: `> ${user.toString()}`,embeds: [embed], files: [attachment]})

        const memberObject = Util.getMember(interaction.targetId)
        if (!memberObject) return

        memberObject.pets++
        Util.saveFile('/root/legionary/members.json', members)
    }
}