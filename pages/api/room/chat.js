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
    res.setHeader("Content-Type", "application/json")

    if (!room) {
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

    if (!room.isPrivate) {
        const activity = await Activity.create({
            action: "Replied in",
            message: chat.fuse,
            sender: user._id,
            room: room._id,
        })
        await activity.save()
    }

    const data = await Chat.findById(chat.id)

    const socketIO = res?.socket?.server?.io || null

    if (room.isPrivate) {
        const aiChat = await createPrivateResponse(room.slug, fuse, user)
        if (aiChat) {
            res.status(200).send(
                JSON.stringify([data.toJSON(), aiChat.toJSON()]),
            )
            return
        }
    }
    res.status(200).send(JSON.stringify(data.toJSON()))

    if (socketIO) {
        socketIO.to(room.slug).emit("fusechat", data.toJSON())
    }
    createAIResponse(room.slug, fuse, user, socketIO, room.AI_MODEL)
}

async function createPrivateResponse(slug, fuse, user) {
    const room = await Room.findOne({ slug }).populate("host")
    const prompt = buildPromptBody(fuse, room, user)
    if (prompt !== "no-need") {
        const aiResponse = await getChatGPTResponse(prompt)
        if (typeof aiResponse === "string") {
            const chat = await Chat.create({
                fuse: aiResponse,
                room: room._id,
                sender: room.AI_MODEL,
            })
            room.chatfuses.push(chat._id)
            await room.save()
            const data = await Chat.findById(chat.id)
            return data
        }
    }
    return null
}

async function createAIResponse(slug, fuse, user, socketIO, aiUser) {
    const room = await Room.findOne({ slug }).populate("host")

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
