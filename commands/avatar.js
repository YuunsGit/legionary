const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "avatar",
        description: "Kullanıcıların avatarlarını inceleyebilmesini sağlar.",
        options: [
            {
                type: 6,
                name: "kullanıcı",
                description: "Kimin avatarını incelemek istiyorsun?",
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const id = interaction.options.getUser("kullanıcı").id;
        const guildMember = await interaction.guild.members.fetch(id);

        const embed = new EmbedBuilder()
            .setAuthor({
                name: guildMember.user.username + "#" + guildMember.user.discriminator,
            })
            .setTitle(guildMember.displayName + " Kullanıcısının Avatarı")
            .setColor("#b752b7")
            .setURL(guildMember.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setImage(guildMember.user.displayAvatarURL({ dynamic: true, size: 256 }));
        try {
            interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
        } catch (err) {}
    },
};
