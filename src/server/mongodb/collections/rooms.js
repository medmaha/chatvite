const mongoose = require("mongoose")
const slugify = require("slugify")

const { getChatGPTResponse, promptHeader } = require("../../chatGPT")

if (mongoose.models.Rooms) {
    module.exports = mongoose.model("Rooms")
} else {
    const Schema = new mongoose.Schema({
        name: { type: String, unique: true, capitalize: true },

        slug: { type: String, unique: true },

        description: { type: String, capitalize: true },

        host: {
            type: {
                name: String,
                username: String,
                id: String,
                avatar: String,
            },
        },

        topic: { type: { id: String, name: String, slug: String } },

        members: [
            {
                type: {
                    name: String,
                    username: String,
                    id: String,
                    avatar: String,
                },
            },
        ],

        chatfuses: [
            {
                type: {
                    id: String,
                    fuse: String,
                    sender: {
                        name: String,
                        username: String,
                        id: String,
                        avatar: String,
                    },
                    updatedAt: Date,
                },
            },
        ],
        createdAt: { type: Date, default: () => Date.now(), immutable: true },
        AI_MODEL: {
            type: {
                name: String,
                username: String,
                id: String,
                avatar: String,
            },
        },
    })

    Schema.pre("save", function (next) {
        if (this.isNew) {
            this.AI_MODEL = {
                id: new Date().toString().replace(/\s/g, "").split("+")[0],
                username: "AI",
                name: "AI-" + new Date().toISOString().split(".")[1],
                avatar: "/images/avatar-ai.png",
            }
            this.members.push({
                id: this.host.id,
                name: this.host.name,
                username: this.host.username,
                avatar: this.host.avatar,
            })
            this.members.push({
                id: this.AI_MODEL.id,
                name: this.AI_MODEL.name,
                username: this.AI_MODEL.username,
                avatar: this.AI_MODEL.avatar,
            })
        }
        if (this.isNew || this.isModified("name")) {
            this.slug = slugify(this.name, {
                lower: true,
                truncate: 32,
            })
            const capitalizedName = (name) => {
                let text = name.split("")
                let firstChar = text[0].toUpperCase()

                text[0] = firstChar

                return text.join("")
            }

            this.name = capitalizedName(this.name)
        }
        next()
    })

    Schema.post("save", async function () {
        if (this.chatfuses.length < 1) {
            const initialPromptHeader = promptHeader(this) + "ai:"
            const chatGPTIntroduction = await getChatGPTResponse(
                initialPromptHeader,
            )

            if (typeof chatGPTIntroduction === "string") {
                this.chatfuses.push({
                    id: new Date().toString().replace(/\s/g, "").split("+")[0],
                    fuse: chatGPTIntroduction,
                    sender: { ...this.AI_MODEL },
                    room: this.id,
                })
                this.save()
            }
        }
    })

    const Rooms = mongoose.model("Rooms", Schema)
    module.exports = Rooms
}
