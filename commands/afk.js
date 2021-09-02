const Util = require('../util')

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

        if (interaction.member.id === '429269659582201856' || interaction.member.id === '367357400694521866') {
            interaction.reply({content: '¯\\_(ツ)_/¯', allowedMentions: {repliedUser: true}})
            return
        }

        const member = interaction.member
        let role = ''
        switch (situation) {
            case 'AFK':
                role = '465555266621145119'
                break
            case 'Yemekte':
                role = '772134471125172254'
                break
            case 'Meşgul':
                role = '774377758066606090'
                break
            case 'Derste':
                role = '770632739836657676'
                break
            case 'Dışarıda':
                role = '772134741209907221'
                break
            case 'Küs':
                role = '778258971265073192'
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