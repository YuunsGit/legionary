const {writeFileSync} = require('fs')
const members = require('./members.json')

module.exports = class Util {
    static generateID = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    static emoji = (name, client) => {
        return client.emojis.cache.find(emoji => emoji.name === name)
    }

    static addReactions = async (message, reactions) => {
        await message.react(reactions[0])
        reactions.shift()
        if (reactions.length > 0) {
            setTimeout(() => Util.addReactions(message, reactions), 1000)
        }
    }

    static saveFile = (path, file) => {
        try {
            writeFileSync(path, JSON.stringify(file, null, 4))
        } catch (err){
            console.log(err)
        }
    }

    static getMember = id => {
        if (!members.members.some(one => {return one.id === id})) {
            const newMember = {
                "id": id,
                "messages": 0,
                "lp": 0,
                "penalties": 0,
                "typo": 0,
                "description": 'Bu kullanıcı henüz kendisi hakkında bilgi vermemiş.',
                "pets": 0,
                "bday": 'Belirtilmedi',
                "daily": true,
                "links": []
            }
            members.members.push(newMember)
        }

        let memberObject = {}
        for (const one of members.members) {
            if (one.id === id) {
                memberObject = one
            }
        }
        return memberObject
    }

    static capitalize = str => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
}