const mongoose = require("mongoose")

const populateUserRefs = (doc, next) => {
    doc.populate([
        { path: "room", select: ["_id", "name", "slug"] },
        { path: "topic", select: ["_id", "name", "slug"] },
        { path: "sender", select: ["_id", "name", "username", "avatar"] },
        { path: "target", select: ["_id"] },
    ])
    next()
}

const Schema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rooms",
    },

    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topics",
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },

    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },

    action: { type: String },

    message: { type: String },

    createdAt: { type: Date, default: () => Date.now(), immutable: true },
})

Schema.pre("find", function (next) {
    populateUserRefs(this, next)
})

Schema.pre("findOne", function (next) {
    populateUserRefs(this, next)
})
const Activity = mongoose.model("Activity", Schema, undefined, {
    overwriteModels: true,
    strick: false,
})
module.exports = Activity
