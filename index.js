const config = require("./config.json");
require("dotenv").config();
require("dotenv").config();
const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

client.commands = new Collection();
commands = [];
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

client.on("ready", async () => {
    client.user.setActivity({
        name: config.status.name,
        type: config.status.type,
    });

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        await client.commands.set(command.data.name, command);

        if (command.data.constructor === {}.constructor) commands.push(command.data);
        else commands.push(command.data.toJSON());
    }

    await client.guilds.cache
        .get("419963388941172737")
        ?.commands.fetch()
        .then((commands) => {
            for (const cmd of commands) {
                const cmdObj = client.commands.get(cmd[1].name);
                //if (cmdObj.perms) cmd[1].permissions.add({permissions: cmdObj.perms})
            }
        });

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    await (async () => {
        try {
            console.log("Started refreshing application (/) commands.");

            await rest.put(Routes.applicationGuildCommands("857603715028877323", "419963388941172737"), {
                body: commands,
            });

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error(error);
        }
    })();

    fs.readdirSync("./schedules").forEach((file) => {
        require("./schedules/" + file)(client);
    });

    console.log("The client is ready");
});

client.login(config.token);
