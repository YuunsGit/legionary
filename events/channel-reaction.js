const chreaction = require("../schemas/chreaction");
const Util = require("../util");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        const reactions = await chreaction.findOne({ id: message.channel.id });
        if (!reactions) return;

        if (reactions.link && reactions.attachment) {
            if (
                reactions.link &&
                !message.content.includes("http") &&
                reactions.attachment &&
                !message.attachments.size
            )
                return;
        } else if (reactions.link || reactions.attachment) {
            if (
                (reactions.link && !message.content.includes("http")) ||
                (reactions.attachment && !message.attachments.size)
            )
                return;
        }

        setTimeout(() => {
            Util.addReactions(message, [...reactions.reactions]);
        }, 1000);
    },
};
