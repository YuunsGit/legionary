const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const Util = require("../util");
const canvas = require("canvas");
const { registerFont } = require("canvas");

module.exports = {
    data: {
        name: "düello",
        description: "Tahmin gücüne güveniyorsan insanları düelloya davet edebilirsin.",
        options: [
            {
                type: 6,
                name: "kullanıcı",
                description: "Kime düello teklif etmek istiyorsun?",
                required: true,
            },
            {
                type: 4,
                name: "bahis",
                description: "Ne kadar bahis koymak istiyorsun?",
                required: false,
            },
        ],
    },
    async execute(interaction) {
        if (interaction.channel.id !== "935543376126832700") {
            interaction.reply({
                content: `O komudun yeri burası değil, yallah ${interaction.guild.channels.cache
                    .get("935543376126832700")
                    .toString()} kanalına.`,
            });
            return;
        }

        const user = interaction.options.getUser("kullanıcı");
        //const bet = !interaction.options.getInteger("bahis") ? 0 : interaction.options.getInteger("bahis")
        const bet = interaction.options.getInteger("bahis") || 0;

        if (interaction.member.id === user.id) {
            interaction.reply({ content: "https://i.imgur.com/RelDztn.jpg" });
            return;
        }

        if (user.bot) {
            interaction.reply({ content: `Bu bir bot. ${Util.emoji("LN_Pepestare", interaction.client)}` });
            return;
        }

        const memberObjectSelf = await Util.getMember(interaction.member.id);
        const memberObject = await Util.getMember(user.id);

        if (memberObjectSelf.lp < bet) {
            interaction.reply({
                content: `Bu bahsi koyacak kadar paran yok. ${Util.emoji("ln_pepecray", interaction.client)}`,
            });
            return;
        }

        if (memberObject.lp < bet) {
            interaction.reply({
                content: `Rakibinin bu bahsi kabul edecek kadar parası yok. ${Util.emoji(
                    "ln_pepecray",
                    interaction.client
                )}`,
            });
            return;
        }

        const img = canvas.createCanvas(1800, 750);
        const ctx = img.getContext("2d");
        const bg = await canvas.loadImage(`${__dirname}/../images/request.png`);
        const avatar = await canvas.loadImage(user.displayAvatarURL({ format: "jpg" }));
        const avatar2 = await canvas.loadImage(interaction.member.user.displayAvatarURL({ format: "jpg" }));
        const flags = await canvas.loadImage(`${__dirname}/../images/flags.png`);
        registerFont("../legionary/images/Minecraft.ttf", { family: "Minecraft" });
        ctx.font = '120px "Minecraft"';
        ctx.drawImage(bg, 0, 0, img.width, img.height);
        ctx.drawImage(avatar, 54, 54, 204, 204);
        ctx.drawImage(avatar2, 1548, 54, 204, 204);
        ctx.drawImage(flags, 0, 0, flags.width, flags.height);
        ctx.textAlign = "center";
        ctx.fillText("Duello?", 900, 200);

        const attachment = new MessageAttachment(img.toBuffer(), "img.png");

        const embed = new MessageEmbed()
            .setTitle("Düello teklifi aldın!")
            .setColor("#b752b7")
            .setDescription(`Teklif eden: ${interaction.member.toString()}`)
            .setFooter({ text: "Oyunla ilgili bilgi almak için yardım butonuna tıklayabilirsin." })
            .setImage("attachment://img.png")
            .setThumbnail("https://i.imgur.com/QbnJjgx.png");
        const betDesc = bet
            ? `**Bahis miktarı ${bet}${Util.emoji("LP_small_spin", interaction.client)}**`
            : "**Bahis yok**";
        embed.setDescription(embed.description + "\n" + betDesc);

        const row = new MessageActionRow().addComponents(
            new MessageButton().setStyle("SUCCESS").setLabel("Kabul Et").setEmoji("⚔").setCustomId("accept"),
            new MessageButton().setStyle("DANGER").setLabel("Reddet").setEmoji("✋🏽").setCustomId("refuse"),
            new MessageButton().setStyle("SECONDARY").setLabel("Yardım").setEmoji("❔").setCustomId("help")
        );

        const sentEmbed = await interaction.reply({
            content: `> ${user.toString()}`,
            embeds: [embed],
            files: [attachment],
            fetchReply: true,
            components: [row],
        });
        const collector = await sentEmbed.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 3 * 60 * 1000,
        });

        collector.on("collect", async (i) => {
            switch (i.customId) {
                case "accept":
                    if (i.member.id !== user.id) break;

                    await collector.stop("butt");
                    await interaction.editReply({ embeds: [], components: [] });

                    const fight = await interaction.channel.createMessageCollector({
                        filter: (m) => !isNaN(m.content),
                        time: 2 * 60 * 1000,
                    });

                    const players = [interaction.member, await interaction.guild.members.fetch(user.id)];

                    fight.on("collect", async (m) => {
                        await m.delete();

                        if (players[0] === m.member) {
                        }
                    });

                    break;

                case "refuse":
                    if (i.member.id !== user.id) break;
                    await interaction.editReply({
                        content: "✋🏽 *Düello teklifi reddedildi.*",
                        embeds: [],
                        components: [],
                    });
                    collector.stop("butt");
                    break;

                case "help":
                    const help = `\n||**Nasıl oynanır?**
                    
                    Düello isteği kabul edilince <@857603715028877323>
                    0 ile 1000 arasında bir sayı belirler.
                    Düello boyunca bu sayıyı tahmin etmekten **kaçınılmalıdır.**
                  
                    İki oyuncu sırayla bir sayı tahmin eder
                    ve her tahminde tahmin aralığı daralır.
                    
                    Bu sayıyı tahmin eden ise **kaybeder.**
                    
                    (0 ve 1000 oyuna dahil değildir.)||`;
                    embed.setDescription(embed.description + "\n" + help);
                    await interaction.editReply({ embeds: [embed], components: [row.spliceComponents(2, 1)] });
            }
            await i.deferUpdate();
        });

        collector.on("end", async (collection, reason) => {
            if (reason !== "butt") {
                await interaction.editReply({
                    content: ":zzz: *Düello teklifine yanıt gelmedi.*",
                    embeds: [],
                    components: [],
                });
                await sentEmbed.removeAttachments();
            }
        });
    },
};
