const Util = require("../util");

module.exports = {
    data: {
        name: "kişisel",
        description: "Kullanıcıların profillerini kişiselleştirebilmesini sağlar.",
        options: [
            {
                type: 3,
                name: "işlem",
                description: "Profilin hakkında hangi işlemi yapmak istiyorsun?",
                required: true,
                choices: [
                    {
                        name: "Bağlantı ekle",
                        value: "bağekle",
                    },
                    {
                        name: "Bağlantı sil",
                        value: "bağsil",
                    },
                    {
                        name: "Doğum günü belirle",
                        value: "dgünü",
                    },
                    {
                        name: "Hakkında bilgi ver",
                        value: "hakkımda",
                    },
                ],
            },
            {
                type: 3,
                name: "değer",
                description: "Düzenleyeceğin bağlantı platformu, doğum günün veya hakkında gireceğin bilgi nedir?",
                required: true,
            },
            {
                type: 3,
                name: "bağlantı",
                description: "Ekleyeceğin bağlantı nedir?",
                required: false,
            },
        ],
    },
    async execute(interaction) {
        const memberObject = await Util.getMember(interaction.member.id);
        const action = interaction.options.getString("işlem");
        const second = interaction.options.getString("değer");
        const third = interaction.options.getString("bağlantı");

        switch (action) {
            case "bağekle":
                if (!third) {
                    interaction.reply({
                        content: `Ekleyecek bir bağlantı girmelisin. ${Util.emoji("ln_pepezoom", interaction.client)}`,
                        ephemeral: true,
                    });
                }
                const linkObj = {
                    inline: true,
                    name: second,
                    value: third,
                };
                if (third.includes("http")) {
                    linkObj.value = "[Buraya tıkla](" + third + ")";
                }
                memberObject.links.push(linkObj);
                interaction.reply({
                    content: `${second} bağlantısı profiline başarıyla eklendi. ${Util.emoji(
                        "ln_pepeok",
                        interaction.client
                    )}`,
                });
                break;

            case "bağsil":
                let a = 0;
                for (const one of memberObject.links) {
                    if (one.name.toLowerCase() === second.toLowerCase()) {
                        memberObject.links.splice(a, 1);
                        interaction.reply({
                            content: `${second} bağlantısı profilinden silindi. ${Util.emoji(
                                "ln_pepeok",
                                interaction.client
                            )}`,
                        });
                        return;
                    }
                    a++;
                }
                interaction.reply({
                    content: `Bu isme sahip bir bağlantı platformu bulunamadı. ${Util.emoji(
                        "ln_pepezoom",
                        interaction.client
                    )}`,
                    ephemeral: true,
                });
                break;

            case "dgünü":
                memberObject.bday = second;
                interaction.reply({
                    content: `Doğum günün başarıla ${second} olarak ayarlandı. ${Util.emoji(
                        "ln_pepeok",
                        interaction.client
                    )}`,
                });
                break;

            case "hakkımda":
                if (second.length > 500) {
                    interaction.reply({
                        content: "Desteklenen maksimum karakter sayısı 500'dür. Düzenleyip tekrar kullanabilirsin.",
                        ephemeral: true,
                    });
                    return;
                }
                memberObject.description = second;
                interaction.reply({ content: "Girdiğin bilgi başarıyla alındı ve profiline kaydedildi." });
        }

        await memberObject.save();
    },
};
