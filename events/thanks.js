const thanks = require('../thanks.json')
const Util = require('../util')

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.mentions.users.size !== 1 || !message.mentions.users.has('857603715028877323')) return
        for (const thank of thanks.thanks) {
            if (message.content.toLowerCase().includes(thank.toLowerCase())) {
                const welcome = thanks.welcomes[Math.floor(Math.random() * thanks.welcomes.length)]
                message.reply(Util.capitalize(welcome))
                break
            }
        }
    }
}