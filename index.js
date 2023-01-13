require("dotenv").config();
const config = require("./schemas/config");
const fs = require("fs");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
const mongoose = require("mongoose");
const { Player } = require("discord-player");
const player = new Player(client);

client.commands = new Collection();
commands = [];
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

client.on("ready", async () => {
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        await client.commands.set(command.data.name, command);

        if (command.data.constructor === {}.constructor) commands.push(command.data);
        else commands.push(command.data.toJSON());
    }

    await mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.log(err));

    configFile = await config.findOne();

    client.user.setActivity({
        name: configFile.status.name,
        type: configFile.status.action,
    });

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

    setTimeout(async () => {
        const queue = player.createQueue(client.guilds.cache.get("419963388941172737"));

        try {
            if (!queue.connection)
                await queue.connect(
                    client.guilds.cache.get("419963388941172737").channels.cache.get("1063541373191585812")
                );
        } catch {
            queue.destroy();
            return console.log("Error: Could not join voice channel!");
        }

        const track = await player
            .search("https://www.youtube.com/watch?v=jfKfPfyJRdk", {
                requestedBy: client.user,
            })
            .then((x) => x.tracks[0]);
        if (!track) return console.log("Error: Lofi stream not found!");

        queue.play(track);
    }, 2000);
});

client.login(process.env.TOKEN);
