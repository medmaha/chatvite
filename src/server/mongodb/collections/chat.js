const mongoose = require("mongoose")

if (mongoose.models.Chats) {
    module.exports = mongoose.model("Chats")
} else {
    const Schema = new mongoose.Schema({
        fuse: { type: String },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        room: { type: mongoose.Schema.Types.ObjectId, ref: "Rooms" },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
            },
        ],

        createdAt: { type: Date, default: () => Date.now(), immutable: true },
    })

    const populateUserRefs = (doc, next) => {
        doc.populate([
            { path: "sender", select: ["_id", "name", "username", "avatar"] },
            { path: "likes", select: ["_id", "name", "username", "avatar"] },
        ])
        next()
    }

    Schema.pre("find", function (next) {
        populateUserRefs(this, next)
    })

    Schema.pre("findOne", function (next) {
        populateUserRefs(this, next)
    })

    const Chats = mongoose.model("Chats", Schema)
    module.exports = Chats
}
