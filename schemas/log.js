const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logSchema = new Schema({
    type: String,
    id: String,
    log: String,
    logger: String,
    date: String,
});

const log = mongoose.model("log", logSchema);
module.exports = log;
