module.exports = {
    data: {
        name: 'ping',
        description: 'Yunus\'un sunucu gecikmesini ölçmebilmesini sağlayan süper bir komut.',
    },
    perms: [
        {
            id: '305044214239068162',
            type: 'USER',
        }
    ],
    execute(interaction) {
        interaction.reply({
            content: `Pong!\n${Date.now() - interaction.createdTimestamp}ms\n${Math.round(interaction.client.ws.ping)}ms`,
            allowedMentions: {repliedUser: true}
        })
    }
}
