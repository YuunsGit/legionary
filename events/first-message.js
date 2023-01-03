module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return
        const roleFinder = id => {
            return message.guild.roles.cache.find(r => r.id === id);
        }
        const sectionRoles = [
            '482168207180955648',
            '984599185707925537',
            '482283990770778142',
            '482161913829261323',
            '830084527467921429',
            '535820552389132310',
            '593105892640292887'
        ]
        const member = await message.guild.members.fetch(message.author.id)
        if (member.roles.cache.has(sectionRoles[0])) return
        member.roles.add(sectionRoles.map(role => roleFinder(role)))
    }
}