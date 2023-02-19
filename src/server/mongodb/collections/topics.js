const mongoose = require("mongoose")
const slugify = require("slugify")

if (mongoose.models.Topics) {
    module.exports = mongoose.model("Topics")
} else {
    const Schema = new mongoose.Schema({
        name: { type: String, unique: true },
        slug: { type: String, unique: true },
        creator: {
            type: {
                name: String,
                username: String,
                id: String,
                avatar: String,
            },
        },
        followers: [
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

        // categories: [
        //     { type: mongoose.Schema.Types.ObjectId, ref: "Categories" },
        // ],
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
    const Topics = mongoose.model("Topics", Schema)
    module.exports = Topics
}
