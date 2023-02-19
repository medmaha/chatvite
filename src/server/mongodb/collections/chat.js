const mongoose = require("mongoose")

if (mongoose.models.Chats) {
    module.exports = mongoose.model("Chats")
} else {
    const Schema = new mongoose.Schema({
        fuse: { type: String },
        sender: {
            type: {
                name: String,
                username: String,
                id: String,
                avatar: String,
            },
        },
        room: { type: mongoose.Schema.Types.ObjectId, ref: "Rooms" },
        likes: [
            {
                type: {
                    name: String,
                    username: String,
                    id: String,
                    avatar: String,
                },
            },
        ],

        createdAt: { type: Date, default: () => Date.now(), immutable: true },
        updatedAt: { type: Date, default: () => Date.now() },
    })

    const Chats = mongoose.model("Chats", Schema)
    module.exports = Chats
}
