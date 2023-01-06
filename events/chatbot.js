const smartestchatbot = require("smartestchatbot");

const client = new smartestchatbot.Client(process.env.CHAT_TOKEN);

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.mentions.users.size !== 1 || !message.mentions.users.has("857603715028877323")) return;

        const content = message.content.slice(message.content.indexOf(" ") + 1);
        message.channel.sendTyping();
        client
            .chat(
                {
                    message: content,
                    name: "He-Man",
                    master: "Yunus Emre",
                    user: message.author.id,
                },
                "tr"
            )
            .then((reply) => {
                message.reply({
                    content: reply,
                    allowedMentions: { repliedUser: true },
                });
            });
        message.channel.sendTyping();
    },
};
