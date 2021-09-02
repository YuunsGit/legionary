module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot) return
        ['465555266621145119', '774377758066606090', '772134471125172254', '770632739836657676', '772134741209907221']
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