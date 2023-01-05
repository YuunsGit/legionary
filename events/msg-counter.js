const Util = require("../util");
const config = require("../schemas/config");

module.exports = {
    name: "messageCreate",
    execute(message) {
        if (
            message.author.bot ||
            message.channel.nsfw ||
            ["459189010649055242", "459182432776749058", "773125765239537705"].includes(message.channel.id)
        )
            return;

        // Increment daily messages
        config.findOne().then((configObject) => {
            configObject.messages++;
            configObject.save();
        });

        // Increment message count and lp each message
        Util.getMember(message.author.id).then((memberObject) => {
            memberObject.messages++;
            memberObject.lp += 2;
            memberObject.save();
        });
    },
};
