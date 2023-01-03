module.exports = {
    data: {
        name: "ben",
        description: "AFK rollerini almabilmenizi sağlar.",
        options: [
            {
                type: 3,
                name: "durum",
                description: "Yemeğe mi gidiyorsun? Ya da derse? Yoksa dışarı mı?",
                required: true,
                choices: [
                    {
                        name: "Klavyeden uzaklaşıyorum",
                        value: "AFK"
                    },
                    {
                        name: "Yemeğe",
                        value: "Yemekte"
                    },
                    {
                        name: "Dışarıya",
                        value: "Dışarıda"
                    },
                    {
                        name: "Derse",
                        value: "Derste"
                    },
                    {
                        name: "Meşgulüm",
                        value: "Meşgul"
                    },
                    {
                        name: "Küsüm",
                        value: "Küs"
                    }
                ]
            }
        ]
    },
    execute(interaction) {
        const situation = interaction.options.getString('durum')

        const member = interaction.member
        let role = ''
        switch (situation) {
            case 'AFK':
                role = '465555266621145119'
                break
            case 'Yemekte':
                role = '1013114060415434833'
                break
            case 'Meşgul':
                role = '1013116388451303505'
                break
            case 'Derste':
                role = '1013114184650731535'
                break
            case 'Dışarıda':
                role = '1013115060811485255'
                break
            case 'Küs':
                role = '1013115522101018704'
        }
        member.roles.add(role).then(async () => {
            interaction.reply({
                content: `${situation} rolü verildi. :zzz:`,
                allowedMentions: {repliedUser: true},
                ephemeral: true
            })
            try {
                await member.setNickname(member.displayName + ' 💤')
            } catch (e) {
            }
        })
    }
}