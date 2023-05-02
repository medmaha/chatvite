const mongoose = require("mongoose")
const slugify = require("slugify")
const User = require("./users")
const Chat = require("./chat")

const { getChatGPTResponse, promptHeader } = require("../../chatGPT")

const RoomSchema = new mongoose.Schema({
    name: { type: String, capitalize: true },

    slug: { type: String, unique: true },

    description: { type: String, capitalize: true },

    isPrivate: { type: Boolean, default: true },

    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },

    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topics" },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],

    chatfuses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chats",
        },
    ],

    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chats",
        },
    ],

    createdAt: { type: Date, default: () => Date.now(), immutable: true },
    AI_MODEL: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
})

const populateUserRefs = (doc, next) => {
    doc.populate([
        "isPrivate",
        { path: "topic", select: ["_id", "name", "slug"] },
        { path: "host", select: ["_id", "name", "username", "avatar"] },
        { path: "AI_MODEL", select: ["_id", "name", "username", "avatar"] },
        {
            path: "chatfuses",
            populate: {
                path: "sender",
                model: "Users",
                select: ["_id", "name", "username", "avatar"],
            },
        },
    ])

    // if (doc.isPrivate) {
    //     doc.select("-members")
    // }
    next()
}

RoomSchema.pre("save", async function (next) {
    if (this.isNew) {
        const AIUser = new User({
            name: "AI",
            username:
                "AI-" +
                new Date().toISOString().split(".")[1] +
                `${generateId(10)}`,
            email: `${generateId(4)}@AI${generateId(2)}.${
                new Date().toISOString().split(".")[1] + generateId(3)
            }`,
            avatar: "/images/avatar-ai.png",
        })
        await AIUser.save()
        this.AI_MODEL = AIUser._id

        this.members.push(AIUser)
        this.members.push(this.host)
    }
    if (this.isNew || this.isModified("name")) {
        this.slug = slugify(this.name + `-vid__${generateId(6)}`, {
            lower: true,
            truncate: 64,
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

RoomSchema.post("save", async function (doc, next) {
    if (doc.chatfuses.length < 1) {
        const aiUser = await User.findOne({ _id: this.AI_MODEL })

        const host = await User.findOne({ _id: this.host })

        const initialPromptHeader =
            promptHeader(this, host, this.isPrivate) + "ai:"
        const chatGPTIntroduction = await getChatGPTResponse(
            initialPromptHeader,
        )

        if (typeof chatGPTIntroduction === "string") {
            const chat = await Chat.create({
                fuse: chatGPTIntroduction,
                sender: aiUser._id,
                room: this._id,
            })
            doc.chatfuses.push(chat._id)
            doc.save()
        }
    }
    next()
})

RoomSchema.pre("find", function (next) {
    populateUserRefs(this, next)
})

RoomSchema.pre("findOne", function (next) {
    populateUserRefs(this, next)
})

const Room = mongoose.model("Rooms", RoomSchema, undefined, {
    overwriteModels: true,
    strick: false,
})

module.exports = Room

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

function changeSchemaPath(path, value) {
    const participantsType = RoomSchema.path(path)

    participantsType.set(() => value)

    Room.init(function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Schema updated successfully")
        }
    })
}

// changeSchemaPath("name", { type: String, capitalize: true })
