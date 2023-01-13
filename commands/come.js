const { Player } = require("discord-player");

module.exports = {
    data: {
        name: "gel",
        description: "He-Man'i müzik çalmaya çağırır.",
    },
    execute(interaction) {
        const player = new Player(interaction.client);
        setTimeout(async () => {
            const queue = player.createQueue(interaction.client.guilds.cache.get("419963388941172737"));

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                queue.destroy();
                return console.log("Error: Could not join voice channel!");
            }

            const track = await player
                .search("https://www.youtube.com/watch?v=jfKfPfyJRdk", {
                    requestedBy: interaction.client.user,
                })
                .then((x) => x.tracks[0]);
            if (!track) return console.log("Error: Lofi stream not found!");

            queue.play(track);
        }, 2000);
    },
};
