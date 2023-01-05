const config = require("../schemas/config");
const Util = require("../util");

module.exports = {
    data: {
        name: "durum",
        description: "Botun anlık durumunu değiştirir.",
        options: [
            {
                type: 3,
                name: "durum",
                description: "Ayarlanacak durumun açıklaması nedir?",
                required: true,
            },
            {
                type: 4,
                name: "türü",
                description: "Ayarlanacak durumun türü nedir?",
                required: true,
                choices: [
                    {
                        name: "Oynuyor",
                        value: 0,
                    },
                    {
                        name: "Yayınlıyor",
                        value: 1,
                    },
                    {
                        name: "Dinliyor",
                        value: 2,
                    },
                    {
                        name: "İzliyor",
                        value: 3,
                    },
                    {
                        name: "Custom",
                        value: 4,
                    },
                    {
                        name: "Yarışıyor",
                        value: 5,
                    },
                ],
            },
        ],
    },
    perms: [
        {
            id: "305044214239068162",
            type: "USER",
        },
    ],
    async execute(interaction) {
        const status = interaction.options.getString("durum");
        const type = interaction.options.getInteger("türü");

        // Change presence (status) of the bot
        await interaction.client.user.setPresence({
            activities: [
                {
                    name: status,
                    type: type,
                },
            ],
        });

        // Store status data in config
        configObject = await config.findOne();
        configObject.status = {
            name: status,
            action: type,
        };
        await configObject.save();

        interaction.reply(`Durum başarıyla güncellendi. ${Util.emoji("ln_pepeok", interaction.client)}`);
    },
};
