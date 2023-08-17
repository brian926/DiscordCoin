const mongoose = require("mongoose");

// Create level collection, Default for XP is 1
// since collection would be created for new user
// when a message is posted
const levelSchema = new mongoose.Schema({
    serverId: { type: String, require: true },
    userId: { type: String, require: true, unique: true },
    xp: { type: Number, default: 1 },
    level: { type: Number, default: 0 },
});

const model = mongoose.model("level", levelSchema);

module.exports = model;