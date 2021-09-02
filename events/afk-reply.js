const Util = require('../util')

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        if (message.author.bot || !message.mentions.members) return
        message.mentions.members.forEach(user => {
            let reaction
            if (user.roles.cache.has('772134471125172254')) {
                reaction = `${user.displayName} şu anda yemek yiyor, bilgilendirmiş olayım. ${Util.emoji('ln_pepefull', client)}`
            } else if (user.roles.cache.has('774377758066606090')) {
                reaction = `${user.displayName} oldukça meşgul görünüyor. ${Util.emoji('ln_pepethink', client)}`
            } else if (user.roles.cache.has('770632739836657676')) {
                reaction = `${user.displayName} şu anda derste, yerinde olsam onu rahatsız etmezdim. ${Util.emoji('ln_pepesmart', client)}`
            } else if (user.roles.cache.has('772134741209907221')) {
                reaction = `${user.displayName} şu anda evde değil, haberin olsun. ${Util.emoji('ln_pepecool', client)}`
            } else if (user.roles.cache.has('465555266621145119')) {
                reaction = `${user.displayName} şu anda ekran başında değil, haber vereyim dedim. ${Util.emoji('ln_pepejam', client)}`
            }
            if (reaction !== undefined) message.reply({content: reaction, allowedMentions: {repliedUser: true}})
        })
    }
}
