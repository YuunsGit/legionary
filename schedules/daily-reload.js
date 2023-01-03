const cron = require('node-cron')
const members = require('../members.json')
const Util = require('../util')

module.exports = () => {
    const reloadDaily = new cron.schedule("00 00 21 * * *", () => {
        for (const one of members.members) {
            one.daily = true
        }
        Util.saveFile('../members.json', members)
    }, {})

    reloadDaily.start()
}