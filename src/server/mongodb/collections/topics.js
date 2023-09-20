const mongoose = require("mongoose")
const slugify = require("slugify")

const Schema = new mongoose.Schema({
    name: { type: String, unique: true },
    slug: { type: String, unique: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    createdAt: { type: Date, default: () => Date.now(), immutable: true },

    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
        },
    ],
})
Schema.pre("save", function (next) {
    if (this.isNew || this.isModified("name")) {
        this.slug = slugify(this.name + `vid=${generateId(6)}`, {
            lower: true,
            truncate: 32,
            remove: new RegExp(/('s)/),
        })
    }
    const capitalizedName = (name) => {
        let text = name.split("")
        let firstChar = text[0].toUpperCase()

        text[0] = firstChar

        return text.join("")
    }

    this.name = capitalizedName(this.name)
    next()
})
const populateUserRefs = (doc) => {
    doc.populate([
        { path: "creator", select: ["_id", "name", "username", "avatar"] },
        {
            path: "followers",
            select: ["_id", "name", "username", "avatar"],
        },
    ])
}

Schema.pre("find", function (next) {
    populateUserRefs(this)
    next()
})

Schema.pre("findOne", function (next) {
    populateUserRefs(this)
    next()
})

const Topics = mongoose.model("Topics", Schema, undefined, {
    overwriteModels: true,
    strick: false,
})

module.exports = Topics

function generateId(length = 7) {
    let result = ""
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    function shuffleArray(array = []) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    let data = shuffleArray(characters.split(" ")).join("")
    for (let i = 0; i < length; i++) {
        result += data.charAt(Math.floor(Math.random() * data.length))
    }
    return result
}
