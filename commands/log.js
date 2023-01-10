const { MessageEmbed } = require("discord.js");
const logs = require("../schemas/log");
const Util = require("../util");

module.exports = {
    data: {
        name: "kayıt",
        description: "Günlük, aylık ve yıllık olayları kaydeder.",
        options: [
            {
                type: 3,
                name: "türü",
                description: "Hangi kayıt türünün üzerinde işlem yapılsın?",
                required: true,
                choices: [
                    {
                        name: "Günlük",
                        value: "daily",
                    },
                    {
                        name: "Aylık",
                        value: "monthly",
                    },
                    {
                        name: "Yıllık",
                        value: "annual",
                    },
                ],
            },
            {
                type: 3,
                name: "işlem",
                description: "Hangi işlemi yapmak istiyorsun?",
                required: true,
                choices: [
                    {
                        name: "Listele",
                        value: "liste",
                    },
                    {
                        name: "Sil",
                        value: "sil",
                    },
                    {
                        name: "Ekle",
                        value: "ekle",
                    },
                ],
            },
            {
                type: 3,
                name: "kayıt-id",
                description: "Eklenecek kaydın açıklaması veya silinecek kaydın ID'si nedir?",
                required: false,
            },
        ],
    },
    perms: [
        {
            id: "876461729956126730",
            type: "ROLE",
        },
    ],
    execute(interaction) {
        const genre = interaction.options.getString("türü");
        const action = interaction.options.getString("işlem");
        const third = interaction.options.getString("kayıt-id");

        if (!interaction.member.roles.cache.has("876461729956126730")) {
            interaction.reply({
                content: `Bunu yapabilmek için gereken yetkiye sahip değilsin. ${Util.emoji(
                    "ln_pepezoom",
                    interaction.client
                )}`,
                ephemeral: true,
            });
            return;
        }

        let list = `Henüz hiç kayıt yapılmamış. ${Util.emoji("ln_pepezoom", interaction.client)}`;

        switch (action) {
            case "liste":
                if (logs[genre].length > 0) list = "";
                for (const one of logs[genre]) {
                    list = list + "\n` " + one.id + " ` : " + one.log;
                }
                const embed = new MessageEmbed()
                    .setTitle(Util.capitalize(genre) + ` Kayıtlar:`)
                    .setColor("#b752b7")
                    .setDescription(list);
                interaction.reply({ embeds: [embed] });
                break;

            case "sil":
                if (!third) {
                    interaction.reply({
                        content: `Silinecek kaydın ID'sini de girmen gerekli. ${Util.emoji(
                            "ln_pepezoom",
                            interaction.client
                        )}`,
                        ephemeral: true,
                    });
                    return;
                }
                const logID = third;
                let a = 0;
                for (const day of logs[genre]) {
                    if (day.id === logID) {
                        logs[genre].splice(a, 1);
                        interaction.reply(
                            `${logID} ID'sine sahip kayıt silindi. ${Util.emoji("ln_pepeok", interaction.client)}`
                        );
                        return;
                    }
                    a++;
                }
                interaction.reply({
                    content: `Bu ID'ye sahip bir kayıt bulunamadı. ${Util.emoji("ln_pepezoom", interaction.client)}`,
                    ephemeral: true,
                });
                break;

            case "ekle":
                if (!third) {
                    interaction.reply({
                        content: `Eklenecek kaydı belirtmen gerekiyor. ${Util.emoji(
                            "ln_pepezoom",
                            interaction.client
                        )}`,
                        ephemeral: true,
                    });
                    return;
                }
                const newLog = {
                    id: Util.generateID(),
                    log: Util.capitalize(third),
                    logger: interaction.member.id,
                    date:
                        interaction.createdAt.getUTCDate() +
                        "." +
                        (interaction.createdAt.getUTCMonth() + 1) +
                        "." +
                        interaction.createdAt.getUTCFullYear(),
                };
                logs[genre].push(newLog);
                interaction.reply(`Yeni kayıt başarıyla eklendi. ${Util.emoji("ln_pepeok", interaction.client)}`);
        }

        //Util.saveFile("../logs.json", logs);
    },
};
