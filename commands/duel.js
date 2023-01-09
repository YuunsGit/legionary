const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const Util = require("../util");
const canvas = require("canvas");
const { registerFont } = require("canvas");
const activePlayers = new Set();

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
        const bet = interaction.options.getInteger("bahis") || 0;

        if (activePlayers.has(interaction.member.id)) {
            interaction.reply({
                content: `Sen zaten bir düellodasın. ${Util.emoji("LN_anithink", interaction.client)}`,
            });
            return;
        }

        if (activePlayers.has(user.id)) {
            interaction.reply({
                content: `Bu eleman zaten düelloda. ${Util.emoji("LN_anithink", interaction.client)}`,
            });
            return;
        }

        if (interaction.member.id === user.id) {
            interaction.reply({ content: "https://i.imgur.com/RelDztn.jpg" });
            return;
        }

        if (user.bot) {
            interaction.reply({ content: `Bu bir bot. ${Util.emoji("LN_Pepestare", interaction.client)}` });
            return;
        }

        if (bet < 0) {
            interaction.reply({
                content: `${Util.emoji("ln_pepelaugh", interaction.client)}`,
            });
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

        console.log(__dirname);

        const img = canvas.createCanvas(1104, 621);
        const ctx = img.getContext("2d");
        const bg = await canvas.loadImage(`${__dirname}/../images/duel/bg/bg${Math.floor(Math.random() * 10 + 1)}.png`);
        const avatar = await canvas.loadImage(user.displayAvatarURL({ format: "jpg" }));
        const avatar2 = await canvas.loadImage(interaction.member.user.displayAvatarURL({ format: "jpg" }));
        const frames = await canvas.loadImage(`${__dirname}/../images/duel/bg/frames.png`);
        ctx.drawImage(bg, 0, 0, img.width, img.height);
        ctx.drawImage(avatar, 0, 457, 170, 170);
        ctx.drawImage(avatar2, 940, 457, 170, 170);
        ctx.drawImage(frames, 0, 0, img.width, img.height);
        registerFont("../legionary/images/Minecraft.ttf", { family: "Minecraft" });

        const requestImg = canvas.createCanvas(1104, 621);
        const requestCtx = requestImg.getContext("2d");
        requestCtx.drawImage(img, 0, 0);
        const p1 = await canvas.loadImage(`${__dirname}/../images/duel/player/p1_idle.png`);
        const p2 = await canvas.loadImage(`${__dirname}/../images/duel/player/p2_idle.png`);
        requestCtx.font = '120px "Minecraft"';
        requestCtx.textAlign = "center";
        requestCtx.drawImage(p1, 626, 65, 450, 333);
        requestCtx.drawImage(p2, 28, 65, 450, 333);
        requestCtx.fillText("Duello?", 1104 / 2, 540);

        const attachment = new MessageAttachment(requestImg.toBuffer(), "img.png");

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

                    activePlayers.add(i.member.id);
                    activePlayers.add(user.id);

                    const number = Math.floor(Math.random() * 999 + 1);

                    let max = 1000;
                    let min = 0;
                    let turn = 0;
                    const opponent = await interaction.guild.members.fetch(user.id);
                    const player = interaction.member;
                    const players = [player, opponent];

                    const acceptedEmbed = new MessageEmbed()
                        .setTitle("Teklif kabul edildi!")
                        .setColor("#b752b7")
                        .setDescription(`Sıra sende: ${players[turn].toString()}\nBir sayı gir!`)
                        .setImage("attachment://img.png")
                        .setThumbnail(player.displayAvatarURL());

                    const acceptImg = canvas.createCanvas(1104, 621);
                    const acceptCtx = acceptImg.getContext("2d");
                    acceptCtx.drawImage(img, 0, 0);
                    const acceptP1 = await canvas.loadImage(`${__dirname}/../images/duel/player/p1_attack.png`);
                    const acceptP2 = await canvas.loadImage(`${__dirname}/../images/duel/player/p2_idle.png`);
                    acceptCtx.font = '120px "Minecraft"';
                    acceptCtx.textAlign = "center";
                    acceptCtx.drawImage(acceptP1, 626, 65, 450, 333);
                    acceptCtx.drawImage(acceptP2, 28, 65, 450, 333);
                    acceptCtx.fillText("0 - 1000", 1104 / 2, 540);

                    const attachmentAccept = new MessageAttachment(acceptImg.toBuffer(), "img.png");

                    await collector.stop("button");
                    await interaction.editReply({ embeds: [acceptedEmbed], components: [], files: [attachmentAccept] });

                    const fight = await interaction.channel.createMessageCollector({
                        filter: (m) => !isNaN(m.content),
                        time: 60 * 1000,
                    });

                    fight.on("collect", async (m) => {
                        let estm;
                        try {
                            estm = parseInt(m.content);
                        } catch (e) {
                            return;
                        }

                        if (players[turn].id === m.member.id) {
                            if (estm <= min || estm >= max) return;

                            await m.react(Util.emoji("devload", interaction.client));

                            if (estm < number) {
                                min = estm;
                            } else if (estm > number) {
                                max = estm;
                            }

                            if (estm == number || max - min == 2) {
                                let winner = turn == 0 ? 1 : 0;
                                if (estm != number) winner = turn;
                                await fight.stop(winner + "");

                                return;
                            }
                            turn = turn == 0 ? 1 : 0;

                            const fightImg = canvas.createCanvas(1104, 621);
                            const fightCtx = fightImg.getContext("2d");
                            fightCtx.drawImage(img, 0, 0);
                            const fightP1 = await canvas.loadImage(
                                `${__dirname}/../images/duel/player/p1_${turn == 0 ? "attack" : "idle"}.png`
                            );
                            const fightP2 = await canvas.loadImage(
                                `${__dirname}/../images/duel/player/p2_${turn == 1 ? "attack" : "idle"}.png`
                            );
                            fightCtx.font = '120px "Minecraft"';
                            fightCtx.textAlign = "center";
                            fightCtx.drawImage(fightP1, 626, 65, 450, 333);
                            fightCtx.drawImage(fightP2, 28, 65, 450, 333);
                            fightCtx.fillText(min + " - " + max, 1104 / 2, 540);

                            const fightEmbed = new MessageEmbed()
                                .setTitle("Aralık daraldı!")
                                .setColor("#b752b7")
                                .setDescription(`Sıra sende: ${players[turn].toString()}\nBir sayı gir!`)
                                .setImage("attachment://img.png")
                                .setThumbnail(players[turn].displayAvatarURL());

                            const attachmentFight = new MessageAttachment(fightImg.toBuffer(), "img.png");

                            await interaction.editReply({
                                embeds: [fightEmbed],
                                components: [],
                                files: [attachmentFight],
                            });
                            await m.delete();
                        } else {
                        }
                    });

                    fight.on("end", async (collection, reason) => {
                        const isAfk = !["1", "0"].includes(reason);
                        let winner;
                        if (isAfk) {
                            winner = turn == 0 ? 1 : 0;
                        } else {
                            winner = parseInt(reason);
                        }

                        const endImg = canvas.createCanvas(1104, 621);
                        const endCtx = endImg.getContext("2d");
                        endCtx.drawImage(img, 0, 0);
                        const endP1 = await canvas.loadImage(
                            `${__dirname}/../images/duel/player/p1_${winner == 0 ? "idle" : "die"}.png`
                        );
                        const endP2 = await canvas.loadImage(
                            `${__dirname}/../images/duel/player/p2_${winner == 1 ? "idle" : "die"}.png`
                        );
                        endCtx.font = '120px "Minecraft"';
                        endCtx.textAlign = "center";
                        endCtx.drawImage(endP1, 626, 65, 450, 333);
                        endCtx.drawImage(endP2, 28, 65, 450, 333);
                        endCtx.fillText("Sayi: " + number, 1104 / 2, 540);
                        endCtx.font = '50px "Minecraft"';
                        endCtx.fillText(min + " - " + max, 1104 / 2, 400);

                        const attachmentEnd = new MessageAttachment(endImg.toBuffer(), "img.png");

                        const endEmbed = new MessageEmbed()
                            .setTitle("Oyun bitti!")
                            .setColor("#b752b7")
                            .setDescription(
                                `${isAfk ? "Rakip sanırım uyuyakaldı. :zzz:\n" : ""}
                                Kazanan: ${players[winner].toString()}
                                ${
                                    bet
                                        ? `\n**${bet}${Util.emoji("LP_small_spin", interaction.client)}** kazandın!`
                                        : ""
                                }`
                            )
                            .setImage("attachment://img.png")
                            .setThumbnail(players[winner].displayAvatarURL());

                        if (bet) {
                            const winnerMember = await Util.getMember(players[winner].id);
                            const loserMember = await Util.getMember(players[winner == 0 ? 1 : 0].id);

                            winnerMember.lp += bet;
                            loserMember.lp -= bet;

                            await winnerMember.save();
                            await loserMember.save();
                        }

                        activePlayers.delete(i.member.id);
                        activePlayers.delete(user.id);
                        await interaction.editReply({
                            embeds: [endEmbed],
                            components: [],
                            files: [attachmentEnd],
                        });
                        const toBeDeleted = await interaction.channel.messages.fetch(collection.lastKey());
                        await toBeDeleted.delete();
                    });

                    break;

                case "refuse":
                    if (i.member.id !== user.id) break;
                    await interaction.editReply({
                        content: "✋🏽 *Düello teklifi reddedildi.*",
                        embeds: [],
                        components: [],
                    });
                    collector.stop("button");
                    break;

                case "help":
                    const help = `\n**Nasıl oynanır?**
                    
                    Düello isteği kabul edilince <@857603715028877323>
                    0 ile 1000 arasında bir sayı belirler.
                    Düello boyunca bu sayıyı tahmin etmekten **kaçınılmalıdır.**
                  
                    İki oyuncu sırayla bir sayı tahmin eder
                    ve her tahminde tahmin aralığı daralır.
                    
                    Bu sayıyı tahmin eden ise **kaybeder.**
                    
                    (0 ve 1000 oyuna dahil değildir.)`;
                    embed.setDescription(embed.description + "\n" + help);
                    await interaction.editReply({ embeds: [embed], components: [row.spliceComponents(2, 1)] });
            }
            await i.deferUpdate();
        });

        collector.on("end", async (collection, reason) => {
            if (reason !== "button") {
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
