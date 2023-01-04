const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
    id: String,
    text: String,
    reaction: String,
    type: String,
});

const reaction = mongoose.model("reaction", reactionSchema);
module.exports = reaction;
