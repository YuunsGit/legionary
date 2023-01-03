module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user, client) {
        if (reaction.partial) {
            try {
                await reaction.fetch()
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error)
                return
            }
        }
        if (user.bot) return
        const member = await client.guilds.cache.get('419963388941172737').members.fetch(user.id)
        const sectionRoles = [
            '482168207180955648',
            '984599185707925537',
            '482283990770778142',
            '482161913829261323',
            '830084527467921429',
            '535820552389132310',
            '593105892640292887'
        ]
        sectionRoles.forEach(role => {
            if (!member.roles.cache.has(role)) {
                member.roles.add(role)
            }
        })
    }
}