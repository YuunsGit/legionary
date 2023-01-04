const creactions = require("../channel-reactions.json");
const Util = require("../util");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        for (const one of creactions.reactions) {
            if (message.channel.id !== one.id) continue;

            if (one.link && one.attachment) {
                if (one.link && !message.content.includes("http") && one.attachment && !message.attachments.size)
                    return;
            } else if (one.link || one.attachment) {
                if ((one.link && !message.content.includes("http")) || (one.attachment && !message.attachments.size))
                    return;
            }

            setTimeout(() => {
                Util.addReactions(message, [...one.reactions]);
            }, 1000);
        }
    },
};
