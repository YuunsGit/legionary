const { writeFileSync } = require("fs");
const Member = require("/schemas/member");

module.exports = class Util {
    static generateID = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    static emoji = (name, client) => {
        return client.emojis.cache.find((emoji) => emoji.name === name);
    };

    static addReactions = async (message, reactions) => {
        await message.react(reactions[0]);
        reactions.shift();
        if (reactions.length > 0) {
            setTimeout(() => Util.addReactions(message, reactions), 1000);
        }
    };

    static saveFile = (path, file) => {
        try {
            writeFileSync(path, JSON.stringify(file, null, 4));
        } catch (err) {
            console.log(err);
        }
    };

    static getMember = async (id) => {
        console.log(Member.find({ id: id }));
        if (!Member.find({ id: id })) {
            const member = new Member({
                id: id,
                messages: 0,
                lp: 0,
                penalties: 0,
                typo: 0,
                description: "Bu kullanıcı henüz kendisi hakkında bilgi vermemiş.",
                pets: 0,
                bday: "Belirtilmedi",
                daily: true,
                links: [],
            });
            member.save();
        }

        let memberObject = {};
        for (const one of members.members) {
            if (one.id === id) {
                memberObject = one;
            }
        }
        return memberObject;
    };

    static capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
};
