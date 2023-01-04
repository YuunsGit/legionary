const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
    messages: String,
    status: {
        name: String,
        type: Number,
    },
});

const config = mongoose.model("config", configSchema);
module.exports = config;
