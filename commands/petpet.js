const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const petpet = require("pet-pet-gif");
const Util = require("../util");

module.exports = {
    data: {
        name: "okşa",
        description: "Oyuncuların birbirlerini okşamlarına vesile olur.",
        options: [
            {
                type: 6,
                name: "kullanıcı",
                description: "Kimi okşamak istersin?",
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const id = interaction.options.getUser("kullanıcı").id;

        if (interaction.member.id === "429269659582201856" || interaction.member.id === "367357400694521866") {
            interaction.reply({ content: "¯\\_(ツ)_/¯", allowedMentions: { repliedUser: true } });
            return;
        }

        if (interaction.member.id === id && !interaction.channel.nsfw) {
            interaction.reply({
                content: `Kendini okşamak istiyorsan NSFW kanallarına gidebilirsin. ${Util.emoji(
                    "LN_wowowot",
                    interaction.client
                )}`,
                allowedMentions: { repliedUser: true },
            });
            return;
        }
        let gif = await petpet(interaction.options.getUser("kullanıcı").displayAvatarURL({ extension: "png" }), {
            delay: 30,
        });
        const attachment = new AttachmentBuilder(gif, { name: "pet.gif" });

        const embed = new EmbedBuilder()
            .setColor("#b752b7")
            .setTitle("Okşandın!")
            .setDescription("Okşayan: " + interaction.member.toString())
            .setImage("attachment://pet.gif");
        await interaction.reply({
            content: `> ${interaction.options.getUser("kullanıcı").toString()}`,
            embeds: [embed],
            files: [attachment],
        });

        const memberObject = await Util.getMember(id);
        memberObject.pets++;
        await memberObject.save();
    },
};
