const cron = require("node-cron");
const members = require("../schemas/member");

module.exports = () => {
    const reloadDaily = new cron.schedule(
        "00 00 21 * * *",
        async () => {
            const lgnMembers = await members.find();
            lgnMembers.forEach(async (member) => {
                member.daily = true;
                await member.save();
            });
        },
        {}
    );

    reloadDaily.start();
};
