module.exports = {
    data: {
        name: 'zaman',
        description: 'Yunus\'un sunucu zamanını öğrenmesini sağlayan yüce komut.',
    },
    perms: [
        {
            id: '305044214239068162',
            type: 'USER',
        }
    ],
    execute(interaction) {
       let date_ob = new Date()
       let hours = date_ob.getHours()
       let minutes = date_ob.getMinutes()
       interaction.reply(hours + ":" + minutes)
    }
}