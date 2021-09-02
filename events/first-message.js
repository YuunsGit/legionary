module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return
        const roleFinder = id => {
            return message.guild.roles.cache.find(r => r.id === id);
        }
        const sectionRoles = [
            "482168207180955648",
            "482147939872014337",
            "482161913829261323",
            "830084527467921429",
            "482283990770778142",
            "535820552389132310",
            "593105892640292887"
        ]
        const member = await message.guild.members.fetch(message.author.id)
        sectionRoles.forEach(role => {
            if (!member.roles.cache.has(role)) {
                member.roles.add(roleFinder(role))
            }
        })
    }
}