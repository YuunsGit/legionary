const config = require('../config.json')
const members = require('../members.json')
const Util = require('../util')

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot || message.channel.nsfw || ['459189010649055242', '459182432776749058', '574221710811725824', '773125765239537705'].includes(message.channel.id)) return

        config.messages++
        Util.saveFile('/root/legionary/config.json', config)

        const memberObject = Util.getMember(message.author.id)

        memberObject.messages++
        memberObject.lp += 2
        Util.saveFile('/root/legionary/members.json', members)
    }
}