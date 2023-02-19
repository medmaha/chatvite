const mongoose = require("mongoose")

if (mongoose.models.Activity) {
    module.exports = mongoose.model("Activity")
} else {
    const Schema = new mongoose.Schema({
        room: {
            type: {
                id: String,
                name: String,
                slug: String,
                topic: {
                    name: String,
                    id: String,
                    slug: String,
                },
                host: {
                    name: String,
                    username: String,
                    id: String,
                    avatar: String,
                },
            },
        },

        topic: {
            name: String,
            id: String,
            slug: String,
        },

        sender: {
            type: {
                name: String,
                username: String,
                id: String,
                avatar: String,
            },
        },

        target: {
            type: {
                name: String,
                username: String,
                id: String,
                avatar: String,
            },
        },

        action: { type: String },

        message: { type: String },

        createdAt: { type: Date, default: () => Date.now(), immutable: true },
    })

    const Activity = mongoose.model("Activity", Schema)
    module.exports = Activity
}
