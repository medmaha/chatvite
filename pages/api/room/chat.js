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

    const chat = new Chat({
        fuse: chatMessage,
        room: room._id,
        sender: user._id,
    })
    await chat.save()

    room.chatfuses.push(chat._id)
    room.save()

    const data = await Chat.findById(chat.id)

    if (room.isPrivate) {
        const aiChat = await createPrivateResponse(room, chatMessage, user)
        if (aiChat) {
            res.status(200).send(
                JSON.stringify([data.toJSON(), aiChat.toJSON()]),
            )
            return
        }
    }
    res.status(200).send(JSON.stringify(data.toJSON()))

    if (!room.isPrivate) {
        Activity.create({
            action: "Replied in",
            message: chat.fuse,
            sender: user._id,
            room: room._id,
        })

        const aiResponse = await createAIResponse(
            room,
            chatMessage,
            room.AI_MODEL,
        )

        if (!!aiResponse) {
            try {
                axios.post(`${process.env.WEBSOCKET_URL}/chatvite-ai`, {
                    room_id: room.slug,
                    data: aiResponse,
                })
            } catch (error) {
                console.log(error.message)
            }
        }
    }
}

async function createPrivateResponse(room, chatMessage) {
    const prompt = buildPromptBody(chatMessage, room)
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

async function createAIResponse(room, chatMessage, aiUser) {
    if (!!room) {
        const prompt = buildPromptBody(chatMessage, room)
        if (prompt !== "no-need") {
            const aiResponse = await getChatGPTResponse(prompt)

            if (typeof aiResponse === "string") {
                const chat = await Chat.create({
                    fuse: aiResponse,
                    room: room._id,
                    sender: aiUser._id,
                })

                chat.save()
                room.chatfuses.push(chat._id)
                room.save()

                Activity.create({
                    action: "Replied to",
                    message: chat.fuse,
                    sender: aiUser._id,
                    room: room._id,
                })

                return Chat.findById(chat.id)
            }
        }
    }
}
