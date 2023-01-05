const Discord = require("discord.js");
const config = require("../config.json");
const logs = require("../logs.json");
const cron = require("node-cron");
const fs = require("fs");
const weather = require("openweather-apis");
const Util = require("../util");
const { MessageEmbed } = require("discord.js");
const members = require("../members.json");
const reactions = require("../reactions.json");
const Reaction = require("../schemas/reaction");
const Member = require("../schemas/member");
const Log = require("../schemas/log");
const fetch = require("node-fetch");
const createBrowserless = require("browserless");
const getHTML = require("html-get");

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
    async execute(interaction) {
        const getContent = async (url) => {
            // create a browser context inside Chromium process
            const browserContext = browserlessFactory.createContext();
            const getBrowserless = () => browserContext;
            const result = await getHTML(url, { getBrowserless });
            // close the browser context after it's used
            await getBrowserless((browser) => browser.destroyContext());
            return result;
        };
        getContent("https://example.com")
            .then((content) => {
                console.log(content);
                process.exit();
            })
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    },
};
