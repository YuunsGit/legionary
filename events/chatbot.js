const cleverbot = require("cleverbot-free");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.mentions.users.size !== 1 || !message.mentions.users.has("857603715028877323")) return;

        const content = message.content.slice(message.content.indexOf(" ") + 1);

        cleverbot(content).then((response) => message.reply(response));
    },
};
