const {MessageEmbed} = require("discord.js");
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message.content.startsWith('https://discord.com/channels/')) return

        const content = message.content.replace('https://discord.com/channels/', '')
        const IDs = content.split('/')
        const guild = IDs[0]
        const channel = IDs[1]
        const msg = IDs[2]

        const mentioned = await client.guilds.cache.get(guild).channels.cache.get(channel).messages.fetch(msg)

        if (!mentioned.content) return

        const embed = new MessageEmbed()
            .setAuthor(mentioned.author.username + ':', mentioned.author.displayAvatarURL({dynamic: true}))
            .setColor("#b752b7")
            .setDescription('> ' + mentioned.content)
            .setFooter('#' + client.guilds.cache.get(guild).channels.cache.get(channel).name + ' • ' + mentioned.createdAt.getUTCDate() + ' . ' + (mentioned.createdAt.getUTCMonth() + 1) + '.' + mentioned.createdAt.getUTCFullYear())

        message.reply({embeds: [embed]})
    }
}