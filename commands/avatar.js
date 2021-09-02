const {MessageEmbed} = require('discord.js')

module.exports = {
    data: {
        name: "avatar",
        description: "Kullanıcıların avatarlarını inceleyebilmesini sağlar.",
        options: [
            {
                type: 6,
                name: "kullanıcı",
                description: "Kimin avatarını incelemek istiyorsun?",
                required: true
            }
        ]
    },
    async execute(interaction) {
        if (interaction.member.id === '429269659582201856' || interaction.member.id === '367357400694521866') {
            interaction.reply({content: '¯\\_(ツ)_/¯', allowedMentions: {repliedUser: true}})
            return
        }

        const id = interaction.options.getUser('kullanıcı').id
        const guildMember = await interaction.guild.members.fetch(id)

        const embed = new MessageEmbed()
            .setAuthor(guildMember.user.username + '#' + guildMember.user.discriminator)
            .setTitle(guildMember.displayName + ' Kullanıcısının Avatarı')
            .setColor("#b752b7")
            .setURL(guildMember.user.displayAvatarURL({dynamic: true, size: 256}))
            .setImage(guildMember.user.displayAvatarURL({dynamic: true, size: 256}))
        try {
            interaction.reply({embeds: [embed], allowedMentions: {repliedUser: true}})
        } catch (err) {
        }
    }
}