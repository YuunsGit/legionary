const Discord = require("discord.js");
const cron = require("node-cron");
const fs = require("fs");
const weather = require("openweather-apis");
const Util = require("../util");
const { EmbedBuilder } = require("discord.js");
const Reaction = require("../schemas/reaction");
const Member = require("../schemas/member");
const Log = require("../schemas/log");
const fetch = require("node-fetch");

module.exports = {
    data: {
        name: "debug",
        description: "Yunus'un efsanevi sorun gidericisi.",
        options: [
            {
                name: "asdf",
                description: "asdf",
                type: 6,
            },
        ],
    },
    perms: [
        {
            id: "305044214239068162",
            type: "USER",
        },
    ],
    async execute(interaction) {},
};
