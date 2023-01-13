const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (!message.content.startsWith("https://discord.com/channels/")) return;

        const content = message.content.replace("https://discord.com/channels/", "");
        const IDs = content.split("/");
        const guild = IDs[0];
        const channel = IDs[1];
        const msg = IDs[2];

        const mentioned = await client.guilds.cache.get(guild).channels.cache.get(channel).messages.fetch(msg);

        if (!mentioned.content) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: mentioned.author.username + ":",
                iconURL: mentioned.author.displayAvatarURL({ dynamic: true }),
            })
            .setColor("#b752b7")
            .setDescription("> " + mentioned.content)
            .setTimestamp(mentioned.createdAt)
            .setFooter({ text: "#" + client.guilds.cache.get(guild).channels.cache.get(channel).name });

        message.reply({ embeds: [embed] });
    },
};
