const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "eval",
        description: "Yunus'un efsanevi işlem monitörü.",
        options: [
            {
                name: "işlem",
                description: "eval",
                type: 3,
                required: true,
            },
        ],
    },
    perms: [
        {
            id: "305044214239068162",
            type: "USER",
        },
    ],
    async execute(interaction) {
        const input = interaction.options.getString("işlem");

        try {
            const output = await eval(input);

            const embed = new EmbedBuilder().setTitle("EVAL").addFields(
                {
                    inline: false,
                    name: "INPUT",
                    value: "```\n" + input + "\n```",
                },
                {
                    inline: false,
                    name: "OUTPUT",
                    value: "```\n" + output + "\n```",
                }
            );

            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.reply({ content: e.toString() });
        }
    },
};
