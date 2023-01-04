const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chreactionSchema = new Schema({
    id: String,
    reactions: [String],
    link: Boolean,
    attachment: Boolean,
});

const chreaction = mongoose.model("chreaction", chreactionSchema);
module.exports = chreaction;
