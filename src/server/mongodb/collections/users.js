const mongoose = require("mongoose")
const slugify = require("slugify")

if (mongoose.models?.Users) {
    module.exports = mongoose.model("Users")
} else {
    const Schema = new mongoose.Schema({
        name: { type: String },
        email: { type: String, unique: true },
        avatar: { type: String, default: "/images/avatar.png" },
        username: { type: String, unique: true },
        password: { type: String },
        createdAt: { type: Date, default: () => Date.now(), immutable: true },
        updateAt: { type: Date, default: () => Date.now(), immutable: true },
        followers: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        following: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        active: { type: Boolean, default: false },
    })
    const populateUsers = (doc, next) => {
        doc.select("-followers -password -email -following")
        next()
    }

    Schema.pre("find", function (next) {
        populateUsers(this, next)
    })
    Schema.pre("save", function (next) {
        if (!this.isNew) {
            this.updateAt = Date.now()
        }
        next()
    })

    const Users = mongoose.model("Users", Schema)
    module.exports = Users
}
