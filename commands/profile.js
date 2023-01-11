const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require("discord.js");
const Util = require("../util");
const canvas = require("canvas");

module.exports = {
    data: {
        name: "profil",
        description: "Kullanıcıların Legion profillerini incelemelerini sağlar.",
        options: [
            {
                type: 6,
                name: "kullanıcı",
                description: "Kimin profilini incelemek istiyorsun?",
                required: false,
            },
        ],
    },
    async execute(interaction) {
        if (interaction.channel.id === "419963388941172739") {
            interaction.reply({
                content: `O komudun yeri burası değil, yallah ${interaction.guild.channels.cache
                    .get("459189010649055242")
                    .toString()} kanalına.`,
            });
            return;
        }

        if (interaction.member.id === "429269659582201856" || interaction.member.id === "367357400694521866") {
            interaction.reply({ content: "¯\\_(ツ)_/¯", allowedMentions: { repliedUser: true } });
            return;
        }

        const user = interaction.options.getUser("kullanıcı");
        let memberObject = await Util.getMember(interaction.member.id);
        if (user) {
            if (interaction.options.getUser("kullanıcı").bot) {
                interaction.reply({ content: `Bu bir bot. ${Util.emoji("LN_Pepestare", interaction.guild)}` });
                return;
            }
            memberObject = await Util.getMember(user.id);
        }

        const guildMember = await interaction.guild.members.fetch(memberObject.id);

        const pp = canvas.createCanvas(480, 270);
        const ctx = pp.getContext("2d");
        const bg = await canvas.loadImage("./images/bg.png");
        ctx.drawImage(bg, 0, 0, pp.width, pp.height);
        const avatar = await canvas.loadImage(guildMember.user.displayAvatarURL({ format: "jpg" }));
        ctx.beginPath();
        ctx.arc(358, 132, 93, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 265, 39, 186, 186);

        const formatter = new Intl.NumberFormat();

        const attachment = new MessageAttachment(pp.toBuffer(), "profile.png");
        const home = new MessageEmbed()
            .setTitle(guildMember.displayName + " Kullanıcısının Legion İstatistikleri")
            .setAuthor({
                name: "Legion Kullanıcı Profili",
                iconURL:
                    "https://media.discordapp.net/attachments/769124445632987156/860102416250830868/Untitled_Artwork.png",
            })
            .setColor("#b752b7")
            .addFields([
                {
                    inline: true,
                    name: "Kullanıcı adı: :id:",
                    value: guildMember.user.username + "#" + guildMember.user.discriminator,
                },
                {
                    inline: true,
                    name: "Mesaj sayısı: :keyboard:",
                    value: memberObject.messages.toString(),
                },
                {
                    inline: true,
                    name: "Legion puanı: :yen:",
                    value:
                        formatter.format(memberObject.lp).replace(",", ".") +
                        " " +
                        Util.emoji("LP_small_spin", interaction.client).toString(),
                },
                {
                    inline: true,
                    name: "Yazım yanlışları: :pencil:",
                    value: memberObject.typo.toString(),
                },
                {
                    inline: true,
                    name: "Ceza sayısı: :hammer:",
                    value: memberObject.penalties.toString(),
                },
                {
                    inline: true,
                    name: "Okşanma sayısı: :blush:",
                    value: memberObject.pets.toString(),
                },
                {
                    inline: true,
                    name: "Doğum günü: :cupcake:",
                    value: memberObject.bday.toString(),
                },
                {
                    inline: true,
                    name: "Sunucuya katılma tarihi: :calendar:",
                    value:
                        (guildMember.joinedAt.getUTCDate().toString().length === 1
                            ? "0" + guildMember.joinedAt.getUTCDate()
                            : guildMember.joinedAt.getUTCDate()) +
                        "." +
                        ((guildMember.joinedAt.getUTCMonth() + 1).toString().length === 1
                            ? "0" + (guildMember.joinedAt.getUTCMonth() + 1)
                            : guildMember.joinedAt.getUTCMonth() + 1) +
                        "." +
                        guildMember.joinedAt.getUTCFullYear(),
                },
            ])
            .setImage("attachment://profile.png")
            .setFooter("/kişisel komuduyla profil özelliştirmelerine göz atabilirsin");

        const links = new MessageEmbed()
            .setTitle(guildMember.displayName + " Kullanıcısının Bağlantıları")
            .setAuthor(
                "Legion Kullanıcı Profili",
                "https://media.discordapp.net/attachments/769124445632987156/860102416250830868/Untitled_Artwork.png"
            )
            .setColor("#b752b7")
            .addFields(memberObject.links)
            .setImage("attachment://profile.png")
            .setFooter("/kişisel komuduyla profil özelliştirmelerine göz atabilirsin");
        if (memberObject.links.length <= 0) {
            links.setDescription("Bu kullanıcı henüz bağlantı eklememiş.");
        }

        const about = new MessageEmbed()
            .setTitle(guildMember.displayName + " Kullanıcısı Hakkında Bilgi")
            .setAuthor(
                "Legion Kullanıcı Profili",
                "https://media.discordapp.net/attachments/769124445632987156/860102416250830868/Untitled_Artwork.png"
            )
            .setColor("#b752b7")
            .setDescription("**Hakkında:**\n" + memberObject.description)
            .setImage("attachment://profile.png")
            .setFooter("/kişisel komuduyla profil özelliştirmelerine göz atabilirsin");

        const row = new MessageActionRow().addComponents(
            new MessageButton().setStyle("SUCCESS").setLabel("Ana Sayfa").setCustomId("home").setEmoji("🏠"),
            new MessageButton().setStyle("SUCCESS").setLabel("Bağlantılar").setCustomId("links").setEmoji("🔗"),
            new MessageButton().setStyle("SUCCESS").setLabel("Hakkında").setCustomId("about").setEmoji("📜"),
            new MessageButton().setStyle("DANGER").setEmoji("✖").setCustomId("exit")
        );

        const sentEmbed = await interaction.reply({
            embeds: [home],
            components: [row],
            allowedMentions: {
                repliedUser: user,
            },
            files: [attachment],
            fetchReply: true,
        });
        const collector = await sentEmbed.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 1000 * 60 * 2,
        });

        collector.on("collect", async (i) => {
            switch (i.customId) {
                case "home":
                    await interaction.editReply({ embeds: [home] });
                    break;
                case "links":
                    await interaction.editReply({ embeds: [links] });
                    break;
                case "about":
                    await interaction.editReply({ embeds: [about] });
                    break;
                case "exit":
                    if (interaction.member.id === i.member.id) {
                        await sentEmbed.removeAttachments();
                        await interaction.editReply({
                            content: "> *Profil penceresi kapatıldı.*",
                            embeds: [],
                            components: [],
                        });
                    }
            }
            await i.deferUpdate();
        });

        collector.on("end", async (i) => {
            await sentEmbed.removeAttachments();
            await interaction.editReply({
                content: "> *Profil penceresi otomatik olarak kapatıldı.*",
                embeds: [],
                components: [],
            });
        });
    },
};
