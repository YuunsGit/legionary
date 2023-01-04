const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    id: String,
    messages: Number,
    lp: Number,
    penalties: Number,
    typo: Number,
    description: Number,
    pets: Number,
    bday: String,
    daily: Boolean,
    links: [
        {
            inline: Boolean,
            name: String,
            value: String,
        },
    ],
});

const member = mongoose.model("member", memberSchema);
module.exports = member;
