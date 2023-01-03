module.exports = {
    data: {
        name: 'söyle',
        description: 'He-Man bir şey mi dedi?',
        options: [
            {
                name: 'mesaj',
                description: 'Ne desin?',
                type: 3,
                required: true
            },
            {
                name: 'yanıtla',
                description: 'Hangi mesajı yanıtlasın?',
                type: 3
            }
        ]
    },
    perms: [
        {
            id: '305044214239068162',
            type: 'USER',
        }
    ],
    async execute(interaction) {
        const msg = interaction.options.getString('mesaj')
        const id = interaction.options.getString('yanıtla')
        await interaction.reply({content: 'Söyledim.', ephemeral: true})

        if (!id) {
            interaction.channel.send(msg)
        }
        else {
            const ref = await interaction.channel.messages.fetch(id)
            ref.reply({content: msg, allowedMentions: {repliedUser: true}})
        }
    }
}