const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const petpet = require("pet-pet-gif");
const Util = require("../util");

module.exports = {
    data: {
        name: "Okşa",
        type: 2,
    },
    async execute(interaction) {
        if (interaction.member.id === interaction.targetId && !interaction.channel.nsfw) {
            interaction.reply({
                content: `Kendini okşamak istiyorsan NSFW kanallarına gidebilirsin. ${Util.emoji(
                    "LN_wowowot",
                    interaction.client
                )}`,
                allowedMentions: { repliedUser: true },
            });
            return;
        }
        const user = await interaction.guild.members.fetch(interaction.targetId);
        let gif = await petpet(user.user.displayAvatarURL({ extension: "png" }), { delay: 30 });
        const attachment = new AttachmentBuilder(gif, { name: "pet.gif" });

        const embed = new EmbedBuilder()
            .setColor("#b752b7")
            .setTitle("Okşandın!")
            .setDescription("Okşayan: " + interaction.member.toString())
            .setImage("attachment://pet.gif");
        await interaction.reply({ content: `> ${user.toString()}`, embeds: [embed], files: [attachment] });

        const memberObject = await Util.getMember(interaction.targetId);
        memberObject.pets++;
        await memberObject.save();
    },
};
