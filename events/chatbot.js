module.exports = {
  name: "messageCreate",
  async execute(message) {
    console.log(message.content);

    if (
      message.mentions.users.size !== 1 ||
      !message.mentions.users.has("857603715028877323")
    )
      return;
    if (message.author.id == "857603715028877323") return;
  },
};
