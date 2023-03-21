// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Authenticate from "../../../src/server/authenticate"
import {
    User,
    Room,
    Chat,
    Activity,
} from "../../../src/server/mongodb/collections"
import {
    buildPromptBody,
    getChatGPTResponse,
} from "../../../src/server/chatGPT"

export default async function handler(req, res) {
    const { fuse, roomId, slug } = req.body

    const user = await Authenticate(req, res)

    const room = await Room.findById(roomId).populate("AI_MODEL")

    if (!user) {
        return
    }
    if (!room) {
        res.setHeader("content-type", "application/json")
        res.status(400).send({ message: "Bad request" })
        res.end()
    }

    const chat = new Chat({
        fuse,
        room: room._id,
        sender: user._id,
    })

    await chat.save()

    room.chatfuses.push(chat._id)

    await room.save()

    const activity = await Activity.create({
        action: "Replied in",
        message: chat.fuse,
        sender: user._id,
        room: room._id,
    })

    const data = await Chat.findById(chat.id)
    await activity.save()

    res.setHeader("Content-Type", "application/json")
    res.status(200).send(JSON.stringify(data.toJSON()))

    const socketIO = res?.socket?.server?.io || null

    if (socketIO) {
        socketIO.to(room.slug).emit("fusechat", data.toJSON())
    }

    // const aiUser = await User.findOne({ _id: room.AI_MODEL })

    createAIResponse(room.slug, fuse, user, socketIO, room.AI_MODEL)
}

async function createAIResponse(slug, fuse, user, socketIO, aiUser) {
    const room = await Room.findOne({ slug })

    if (room) {
        const prompt = buildPromptBody(fuse, room, user)

        if (prompt !== "no-need") {
            const aiResponse = await getChatGPTResponse(prompt)

            if (typeof aiResponse === "string") {
                const chat = await Chat.create({
                    fuse: aiResponse,
                    room: room._id,
                    sender: aiUser._id,
                })
                room.chatfuses.push(chat._id)
                await room.save()

                if (socketIO) {
                    const data = await Chat.findById(chat.id)
                    socketIO.to(slug).emit("fusechat-ai", data.toJSON())
                }

                const activity = await Activity.create({
                    action: "Replied to",
                    message: chat.fuse,
                    sender: aiUser._id,
                    room: room._id,
                })

                await activity.save()
            }
        }
    }
}
