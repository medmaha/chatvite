import Authenticate from "../../../../src/server/authenticate"
import {
    Room,
    Chat,
    Activity,
} from "../../../../src/server/mongodb/collections"
import {
    buildPromptBody,
    getChatGPTResponse,
} from "../../../../src/server/chatGPT"

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

    if (room.isPrivate) return res.status(200).send(chat.toJSON())

    await Activity.create({
        action: randomActivityAction(),
        message: chat.fuse,
        sender: user._id,
        room: room._id,
    })
    return res.status(200).send(chat.toJSON())
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
