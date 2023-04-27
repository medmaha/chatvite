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

    const chat = await Chat.create({
        fuse: chatMessage,
        room: room._id,
        sender: user._id,
    })

    room.chatfuses.push(chat._id)
    await room.save()

    if (!!room.isPrivate) {
        const aiChat = await createPrivateResponse(
            room,
            chatMessage,
            user.username,
        )
        console.log(aiChat)
        if (aiChat._id) {
            res.status(200).send(
                JSON.stringify([
                    (await chat.populate("sender")).toJSON(),
                    aiChat,
                ]),
            )
            return
        } else {
            res.status(200).send(
                JSON.stringify([(await chat.populate("sender")).toJSON()]),
            )
        }
    } else {
        await Activity.create({
            action: randomActivityAction(),
            message: chat.fuse,
            sender: user._id,
            room: room._id,
        })
        createAIResponse(room, chatMessage, room.AI_MODEL, user.username)
        const chatJSON = (await chat.populate("sender")).toJSON()
        res.status(200).send(chatJSON)
    }
}

async function createPrivateResponse(room, chatMessage, authorName) {
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

async function createAIResponse(room, chatMessage, aiUser, authorName) {
    if (room) {
        const prompt = buildPromptBody(chatMessage, room, authorName)
        if (prompt !== "no-need" && Boolean(prompt)) {
            const aiResponse = await getChatGPTResponse(prompt)

            if (typeof aiResponse === "string" && aiResponse.length > 1) {
                let chat = await Chat.create({
                    fuse: aiResponse,
                    room: room._id,
                    sender: aiUser._id,
                })

                chat = await chat.populate("sender")

                const chatJSON = chat.toJSON()
                await axios.post(`${process.env.WEBSOCKET_URL}/chatvite-ai`, {
                    room_id: room.slug,
                    data: chatJSON,
                })

                room.chatfuses.push(chat._id)
                await room.save()
                await Activity.create({
                    action: randomActivityAction(),
                    message: chat.fuse,
                    sender: aiUser._id,
                    room: room._id,
                })

                return Promise.resolve()
            }
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
