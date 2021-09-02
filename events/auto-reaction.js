const reactions = require('../reactions.json')
const members = require('../members.json')
const Util = require('../util')

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.id === '429269659582201856' || message.author.id === '367357400694521866') {
            return
        }
        if (message.author.bot || !message.mentions.members || message.channel.id === '460483132508995584') return
        for (const one of reactions.meme) {
            if (message.content === one.text) {
                message.reply({
                    content: one.reaction.replace('{user}', message.author.toString()),
                    allowedMentions: {repliedUser: true}
                })
                return
            }
        }
        for (const one of reactions.typo) {
            if (message.content.includes(`${one.text} `) || message.content.includes(` ${one.text}`) || message.content === one.text) {
                message.reply({
                    content: Util.capitalize(one.reaction.replace('{user}', message.author.toString())),
                    allowedMentions: {repliedUser: true}
                })

                const memberObject = Util.getMember(message.author.id)
                memberObject.typo++
                memberObject.lp -= 3
                Util.saveFile('/root/legionary/members.json', members)
            }
        }
    }
}
