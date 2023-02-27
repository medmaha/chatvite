const mongoose = require("mongoose")
const slugify = require("slugify")

if (mongoose.models.Topics) {
    module.exports = mongoose.model("Topics")
} else {
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
            this.slug = slugify(this.name, {
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
    const populateUserRefs = (doc, next) => {
        doc.populate([
            { path: "creator", select: ["_id", "name", "username", "avatar"] },
            {
                path: "followers",
                select: ["_id", "name", "username", "avatar"],
            },
        ])
        next()
    }

    Schema.pre("find", function (next) {
        populateUserRefs(this, next)
    })

    Schema.pre("findOne", function (next) {
        populateUserRefs(this, next)
    })

    const Topics = mongoose.model("Topics", Schema)

    module.exports = Topics
}
