const Util = require("../util");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "messageReactionAdd",
    async execute(reaction, user) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error("Something went wrong when fetching the message:", error);
                return;
            }
        }
        try {
            const channel = reaction.message.channel.id;
            const memberObject = await Util.getMember(reaction.message.author.id);
            const cross = new AttachmentBuilder("./images/cross.gif", { name: "idea.gif" });
            const check = new AttachmentBuilder("./images/check.gif", { name: "idea.gif" });

            if (!["513656451475046421", "877160655071871038"].includes(channel)) return;

            if (reaction._emoji.name === "🇩" && user.id === "305044214239068162") {
                await reaction.message.removeAttachments();
            }
            if (!["⬇", "⬆"].includes(reaction._emoji.name)) {
                await reaction.remove();
                return;
            }
            if (reaction.count < 8) return;

            switch (reaction._emoji.name) {
                case "⬇":
                    await reaction.message.removeAttachments();
                    memberObject.lp += 300;
                    reaction.message.edit({ files: [cross] });
                    break;
                case "⬆":
                    await reaction.message.removeAttachments();
                    memberObject.lp -= 300;
                    reaction.message.edit({ files: [check] });
            }

            await memberObject.save();
        } catch (err) {}
    },
};
