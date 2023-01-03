module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot) return
        ['465555266621145119', '1013114184650731535', '1013114060415434833', '1013116388451303505', '1013115060811485255']
            .forEach(value => {
                if (message.member.roles.cache.has(value)) {
                    message.member.roles.remove(value)
                    try {
                        if (message.member.displayName.endsWith(' 💤')) message.member.setNickname(message.member.displayName.replace(' 💤', ''))
                    } catch (e) {
                    }
                }
            })
    }
}