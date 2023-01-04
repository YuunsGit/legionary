const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    message: String,
    type: String,
});

const answer = mongoose.model("answer", answerSchema);
module.exports = answer;
