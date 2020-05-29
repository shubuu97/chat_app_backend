const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    users: {
        type: [],
        required: true,
    },
});

module.exports = mongoose.model("Room", roomSchema);
