const mongoose = require("mongoose")
const slugify = require("slugify")

const populateUsers = (doc, next, friends) => {
    doc.select("-followers -following")
    if (friends) {
        doc.populate("followers")
        doc.populate("following")
    }
    next()
}

const Schema = new mongoose.Schema({
    slug: { type: String },
    name: { type: String },
    email: { type: String, unique: true },
    avatar: { type: String, default: "/images/avatar.png" },
    username: { type: String, unique: true },
    password: { type: String },
    active: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => Date.now(), immutable: true },
    updateAt: { type: Date, default: () => Date.now(), immutable: true },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
})

Schema.pre("find", function (next) {
    populateUsers(this, next)
})

Schema.pre("findOne", function (next) {
    populateUsers(this, next, true)
})

Schema.pre("save", function (next) {
    if (!this.isNew) {
        this.updateAt = Date.now()
    } else {
        this.slug = slugify(this.username)
    }
    next()
})

function changeSchemaPath(path, value) {
    const participantsType = Schema.path(path)

    participantsType.set(() => value)

    Users.init(function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Schema updated successfully")
        }
    })
}

const Users = mongoose.model("Users", Schema, undefined, {
    overwriteModels: true,
    strick: false,
})

module.exports = Users
