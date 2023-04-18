const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const previousChat = [];
const configuration = new Configuration({
  apiKey: process.env.CHAT_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (
      message.mentions.users.size !== 1 ||
      !message.mentions.users.has("857603715028877323")
    )
      return;
    if (message.author.bot) return;

    const content = message.content.replaceAll("<@857603715028877323>", "");

    message.channel.sendTyping();
    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are He-Man. Talk like He-Man. Make jokes in some answers. Answer in Turkish but without double quotes.",
          },
          ...previousChat,
          { role: "user", content: content },
        ],
      })
      .then((res) => {
        previousChat.push({ role: "user", content: content });
        previousChat.push({
          role: "assistant",
          content: res.data.choices[0].message.content,
        });

        if (previousChat.length > 30) {
          previousChat.shift();
          previousChat.shift();
        }

        message.reply(res.data.choices[0].message.content);
      });
  },
};
