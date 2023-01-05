const Discord = require("discord.js");
const config = require("../config.json");
const logs = require("../logs.json");
const cron = require("node-cron");
const fs = require("fs");
const fetch = require("node-fetch");
const weather = require("openweather-apis");
const Util = require("../util");
const { MessageEmbed } = require("discord.js");
const members = require("../members.json");

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

            const embed = new MessageEmbed().setTitle("EVAL").addFields(
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
