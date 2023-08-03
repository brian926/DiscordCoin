const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
    serverId: { type: String, require: true },
    userId: { type: String, require: true, unique: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
});

const model = mongoose.model("level", levelSchema);

module.exports = model;