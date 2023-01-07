const reactions = require("../schemas/reaction");
const Util = require("../util");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.id === "429269659582201856" || message.author.id === "367357400694521866") {
            return;
        }
        if (["472856433797627914", "460483132508995584"].includes(message.channel.id)) return;
        if (message.author.bot || !message.mentions.members) return;

        const memeReaction = await reactions.findOne({ rtype: "meme", text: message.content });
        if (memeReaction) {
            message.reply({
                content: memeReaction.reaction.replace("{user}", message.author.toString()),
                allowedMentions: { repliedUser: true },
            });
            return;
        }

        const typoReactions = await reactions.find({ rtype: "typo" });

        let reactionMsg = "";
        for (const typo of typoReactions) {
            if (
                message.content.includes(`${typo.text} `) ||
                message.content.includes(` ${typo.text}`) ||
                message.content === typo.text
            ) {
                reactionMsg =
                    reactionMsg + "\n" + Util.capitalize(typo.reaction.replace("{user}", message.author.toString()));

                const memberObject = await Util.getMember(message.author.id);
                memberObject.typo++;
                memberObject.lp = Math.max(memberObject.lp - 3, 0);
                await memberObject.save();
            }
        }
        if (reactionMsg === "") return;
        message.reply({
            content: reactionMsg,
            allowedMentions: { repliedUser: true },
        });
    },
};
