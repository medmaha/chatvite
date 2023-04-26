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
import axios from "axios"

export default async function handler(req, res) {
    const { chat: chatMessage, roomId } = req.body

    const user = await Authenticate(req, res)

    if (!user) {
        return
    }

    const room = await Room.findById(roomId).populate("AI_MODEL")

    res.setHeader("Content-Type", "application/json")

    if (!room) {
        res.status(400).send({ message: "Bad request" })
        res.end()
    }

    const chat = await Chat.create({
        fuse: chatMessage,
        room: room._id,
        sender: user._id,
    })

    room.chatfuses.push(chat._id)
    room.save()

    const data = await Chat.findById(chat.id)

    if (!!room.isPrivate) {
        const aiChat = await createPrivateResponse(
            room,
            chatMessage,
            user.username,
        )
        if (aiChat) {
            res.status(200).send(
                JSON.stringify([data.toJSON(), aiChat.toJSON()]),
            )
            return
        }
    } else {
        Activity.create({
            action: "Replied in",
            message: chat.fuse,
            sender: user._id,
            room: room._id,
        })
        await createAIResponse(room, chatMessage, room.AI_MODEL, user.username)
        res.status(200).send(JSON.stringify(data.toJSON()))
    }
}

async function createPrivateResponse(room, chatMessage, authorName) {
    const prompt = buildPromptBody(chatMessage, room, authorName)
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

async function createAIResponse(room, chatMessage, aiUser, authorName) {
    if (!!room) {
        const prompt = buildPromptBody(chatMessage, room, authorName)
        if (prompt !== "no-need") {
            const aiResponse = await getChatGPTResponse(prompt)

            if (typeof aiResponse === "string" && aiResponse.length > 1) {
                const chat = await Chat.create({
                    fuse: aiResponse,
                    room: room._id,
                    sender: aiUser._id,
                })

                axios.post(`${process.env.WEBSOCKET_URL}/chatvite-ai`, {
                    room_id: room.slug,
                    data: (await Chat.findById(chat.id)).toJSON(),
                })

                room.chatfuses.push(chat._id)
                room.save()
                Activity.create({
                    action: "Replied to",
                    message: chat.fuse,
                    sender: aiUser._id,
                    room: room._id,
                })

                return Promise.resolve()
            }
        }
    }
}
