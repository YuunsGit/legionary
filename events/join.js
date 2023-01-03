const {MessageEmbed} = require('discord.js')

module.exports = {
    name: 'guildMemberAdd',
    execute(member, client) {
        if (member.user.bot) return
        const legion = client.guilds.cache.get('419963388941172737').name
        const channel = client.channels.cache.get('479708170932060198')
        const embed = new MessageEmbed()
            .setAuthor({
                name:'Üye Duyurusu:',
                iconURL: client.guilds.cache.get('419963388941172737').iconURL()
            })
            .setTitle(`${legion}'a yeni birisi geldi!`)
            .setColor("#b752b7")
            .setDescription(`Renkli insanların sunucusu ${legion}'a hoş geldin ${member.user.toString()}`)
            .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
            .addFields(
                {
                    inline: false,
                    name: 'Göz atman gereken kanallar:',
                    value: `• <#822981207410606111>\n• <#772719660999114762>\n• <#459813037428178963>`
                }
            )
            .setFooter({text: 'Artık Legion\'da tam ' +client.guilds.cache.get('419963388941172737').memberCount.toString() + ' üye bulunuyor.'})
        channel.send({embeds: [embed]})
    }
}