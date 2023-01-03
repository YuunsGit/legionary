const {MessageEmbed} = require('discord.js')
module.exports = {
    data: {
        name: 'yardım',
        description: 'He-Man neler yapabilir?'
    },
    execute(interaction) {
        const embed = new MessageEmbed({"fields":[{"name":"Kullanıcı Komutları","value":"```fix\n/avatar\n/ben\n/günlük\n/hava\n/sözlük\n/çevir\n/kişisel\n/lp\n/profil\n/öneri\n```","inline":true},{"name":"Eğlence Komutları","value":"```fix\n/okşa\n/yazıtura\n/8top\n```","inline":true},{"name":"Yönetim Komutları","value":"```md\n/durum\n/kayıt\n/lp\n/tepki\n```","inline":true}],"title":"He-Man Komutları:","description":"> Temmuz 2021'den beri geliştirilme sürecinde olan ve şu an v2.0 sürümünde bulunan Legion özel botu <@857603715028877323> Legion kullanıcılarına hizmet etmeye devam ediyor.\n\n> Önerilerinizi ve tespit ettiğiniz hataları bildirmek için <#869517460896907334> ve <#877160655071871038> kanallarını kullanabilirsiniz.","author":{"name":"Legion Özel Botu","icon_url":"https://media.discordapp.net/attachments/769124445632987156/860102416250830868/Untitled_Artwork.png"},"color":12014263,"footer":{"icon_url":"https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/star_2b50.png","text":"Tepki ve kayıt komutlarını kullanabilmek için yöneticilere başvurunuz."}})
        interaction.reply({embeds: [embed]})
    }
}