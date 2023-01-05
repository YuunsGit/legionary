const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
    messages: Number,
    status: {
        name: String,
        action: Number,
    },
});

const config = mongoose.model("config", configSchema);
module.exports = config;
