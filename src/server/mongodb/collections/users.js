const mongoose = require("mongoose")
const slugify = require("slugify")

if (mongoose.models.Users) {
    module.exports = mongoose.model("Users")
} else {
    const Schema = new mongoose.Schema({
        name: { type: String },
        email: { type: String, unique: true },
        password: { type: String },
        username: { type: String, unique: true },
        createdAt: { type: Date, default: () => Date.now(), immutable: true },
    })

    const Users = mongoose.model("Users", Schema)
    module.exports = Users
}
