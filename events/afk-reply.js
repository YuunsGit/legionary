const Util = require('../util')

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        if (message.author.bot || !message.mentions.members) return
        message.mentions.members.forEach(user => {
            let reaction
            if (user.roles.cache.has('1013114060415434833')) {
                reaction = `${user.displayName} şu anda yemekte, bilgilendirmiş olayım. ${Util.emoji('ln_pepefull', client)}`
            } else if (user.roles.cache.has('1013116388451303505')) {
                reaction = `${user.displayName} oldukça meşgul. Rahatsız etmek istemezsin. ${Util.emoji('ln_pepethink', client)}`
            } else if (user.roles.cache.has('1013114184650731535')) {
                reaction = `${user.displayName} şu anda derste, haber vereyim dedim. ${Util.emoji('ln_pepesmart', client)}`
            } else if (user.roles.cache.has('1013115060811485255')) {
                reaction = `${user.displayName} şu anda evde değil, haberin olsun. ${Util.emoji('ln_pepecool', client)}`
            } else if (user.roles.cache.has('465555266621145119')) {
                reaction = `${user.displayName} şu anda AFK, haber vereyim dedim. ${Util.emoji('ln_pepejam', client)}`
            }
            if (reaction !== undefined) message.reply({content: reaction, allowedMentions: {repliedUser: true}})
        })
    }
}
