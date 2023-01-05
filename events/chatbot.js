const openai = require("openai");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.mentions.users.size !== 1 || !message.mentions.users.has("857603715028877323")) return;

        const content = message.content.slice(message.content.indexOf(" ") + 1);
        const completion = await openai.completions.create({
            model: "text-davinci-002",
            prompt: content,
        });

        message.reply(completion.data.choices[0].text);
    },
};
