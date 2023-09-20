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
        return
    }

    const chat = await (
        await Chat.create({
            fuse: chatMessage,
            room: room._id,
            sender: user._id,
        })
    ).populate("sender")

    room.chatfuses.push(chat._id)

    if (!!room.isPrivate) {
        const aiChat = await createPrivateAIResponse(
            room,
            chatMessage,
            user.username,
        )
        if (aiChat._id) {
            res.status(200).send(JSON.stringify([chat.toJSON(), aiChat]))
        } else {
            res.status(200).send(JSON.stringify([chat.toJSON()]))
        }
    } else {
        createPublicAIResponse(room, chatMessage, room.AI_MODEL, user.username)
        Activity.create({
            action: randomActivityAction(),
            message: chat.fuse,
            sender: user._id,
            room: room._id,
        })
        res.status(200).send(chat.toJSON())
    }
    return res.end()
}

async function createPrivateAIResponse(room, chatMessage, authorName) {
    const prompt = buildPromptBody(chatMessage, room, authorName)
    if (prompt !== "no-need" && Boolean(prompt)) {
        const aiResponse = await getChatGPTResponse(prompt)
        if (typeof aiResponse === "string") {
            const chat = await Chat.create({
                fuse: aiResponse,
                room: room._id,
                sender: room.AI_MODEL,
            })
            room.chatfuses.push(chat._id)
            await room.save()
            return (await chat.populate("sender")).toJSON()
        }
    }
    return {}
}

async function createPublicAIResponse(room, chatMessage, aiUser, authorName) {
    const prompt = buildPromptBody(chatMessage, room, authorName)

    if (prompt !== "no-need" && Boolean(prompt)) {
        const aiResponse = await getChatGPTResponse(prompt)

        if (typeof aiResponse === "string" && aiResponse.length > 1) {
            let chat = await (
                await Chat.create({
                    fuse: aiResponse,
                    room: room._id,
                    sender: aiUser._id,
                })
            ).populate("sender")

            room.chatfuses.push(chat._id)

            await axios.post(`${process.env.WEBSOCKET_URL}/chatvite-ai`, {
                room_id: room.slug,
                data: chat.toJSON(),
            })

            Activity.create({
                action: randomActivityAction(),
                message: chat.fuse,
                sender: aiUser._id,
                room: room._id,
            })
        }
    }
}

const activityActions = [
    "Sent a message in",
    "Posted in",
    "Responded in",
    "Added a comment in",
    "Contributed to",
    "Shared a post in",
    // "Started a discussion in",
    "Replied to a message in",
    "Commented on a post in",
    // "Asked a question in",
]

const randomActivityAction = () =>
    activityActions[Math.floor(Math.random() * activityActions.length)]
