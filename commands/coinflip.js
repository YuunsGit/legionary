const { MessageEmbed, MessageAttachment } = require("discord.js");
const member = require("../schemas/member");
const Util = require("../util");
const fs = require("fs");
const talkedRecently = new Set();

module.exports = {
    data: {
        name: "yazıtura",
        description: "Havaya 1 lirayı atar ve galibi belirler.",
        options: [
            {
                type: 3,
                name: "taraf",
                description: "İddiayı hangi taraf üzerinde oynayacaksın?",
                required: false,
                choices: [
                    {
                        name: "Yazı",
                        value: "yazı",
                    },
                    {
                        name: "Tura",
                        value: "tura",
                    },
                    {
                        name: "Dik",
                        value: "dik",
                    },
                ],
            },
        ],
    },
    async execute(interaction) {
        if (interaction.member.id === "429269659582201856" || interaction.member.id === "367357400694521866") {
            interaction.reply({ content: "¯\\_(ツ)_/¯", allowedMentions: { repliedUser: true } });
            return;
        }

        const side = interaction.options.getString("taraf");

        // Under cooldown
        if (talkedRecently.has(interaction.member.id)) {
            interaction.reply({
                content: "Bu komut her 5 saniyede bir kullanılabilir.",
                ephemeral: true,
                allowedMentions: { repliedUser: true },
            });
        } else {
            const memberObject = await member.findOne();

            const value = Math.round(Math.random());
            const random = Math.round(Math.random() * 5000);

            const yazi = new MessageAttachment("./images/yazi.png", "yazi.png");
            const tura = new MessageAttachment("./images/tura.png", "tura.png");
            const dik = new MessageAttachment("./images/dik.png", "dik.png");

            const embed = new MessageEmbed()
                .setDescription("Şans insanlara hakim olur,\ninsanlar şansa değil.")
                .setColor("#805c1a");

            if (random === 525) {
                embed
                    .setTitle("Dik")
                    .setThumbnail("attachment://dik.png")
                    .setDescription(
                        `Az önce bir parayı hava atıp\nyere dik düşürmeyi başardın!\nÖdül olarak tam 999${Util.emoji(
                            "LP_small_spin",
                            interaction.client
                        )} kazandın!`
                    );
                memberObject.lp += 999;
                await interaction.reply({ embeds: [embed], files: [dik], allowedMentions: { repliedUser: true } });
                await memberObject.save();
                return;
            }

            switch (value) {
                case 0:
                    embed.setTitle("Yazı").setThumbnail("attachment://yazi.png");
                    await interaction.reply({ embeds: [embed], files: [yazi], allowedMentions: { repliedUser: true } });
                    break;
                case 1:
                    embed.setTitle("Tura").setThumbnail("attachment://tura.png");
                    await interaction.reply({ embeds: [embed], files: [tura], allowedMentions: { repliedUser: true } });
                    break;
                default:
                    embed.setTitle("Garip bir şeyler oldu").setDescription("Bir hata nedeniyle sonuç bulunamadı.");
            }

            if (side) {
                if (
                    side.toLowerCase() === embed.title.toLowerCase() ||
                    side.toLowerCase() === embed.title.toLowerCase().charAt(0)
                ) {
                    switch (embed.title.toLowerCase()) {
                        case "dik":
                            interaction.editReply({
                                content: `${Util.emoji(
                                    "LN_trigger",
                                    interaction.client
                                )} İddiayı kazandın! Ödülün tam **1000**${Util.emoji(
                                    "LP_small_spin",
                                    interaction.client
                                )}`,
                            });
                            memberObject.lp += 1000;
                            break;
                        default:
                            interaction.editReply({
                                content: `${Util.emoji(
                                    "LN_trigger",
                                    interaction.client
                                )} İddiayı kazandın! Ödülün tam **25**${Util.emoji(
                                    "LP_small_spin",
                                    interaction.client
                                )}`,
                            });
                            memberObject.lp += 25;
                    }
                } else {
                    interaction.editReply({
                        content: `:moyai: İddiayı kaybettin. **50**${Util.emoji(
                            "LP_small_spin",
                            interaction.client
                        )} hesabından alındı.`,
                    });
                    memberObject.lp = Math.max(memberObject.lp - 50, 0);
                }
            }

            await memberObject.save();

            talkedRecently.add(interaction.member.id);
            setTimeout(() => {
                talkedRecently.delete(interaction.member.id);
            }, 5000);
        }
    },
};
