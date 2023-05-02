const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    email: {
        type: String,
    },
    createdAt: { type: Date, default: () => Date.now() },
})

const Subscriptions = mongoose.model("Subscriptions", Schema, undefined, {
    overwriteModels: true,
    strick: false,
})
module.exports = Subscriptions
