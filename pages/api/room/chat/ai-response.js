import {
    Room,
    Chat,
    Activity,
} from "../../../../src/server/mongodb/collections"
import {
    buildPromptBody,
    getChatGPTResponse,
} from "../../../../src/server/chatGPT"

import connectToDatabase from "../../../../src/server/db"

export default async function handler(req, res) {
    const { chat_id, chatroom } = req.body

    connectToDatabase()

    const chat = await Chat.findById(chat_id)
    const room = await Room.findOne({ slug: chatroom }).populate(
        "AI_MODEL",
        "chatfuses.sender",
    )

    res.setHeader("Content-Type", "application/json")

    if (!room || !chat) {
        res.status(400).send({ message: "Bad request" })
        res.end()
        return
    }

    const prompt = await buildPromptBody(chat.fuse, room, chat.sender.name)

    if (Boolean(prompt) && prompt !== "no-need") {
        const aiMessage = await getChatGPTResponse(prompt)
        if (aiMessage && typeof aiMessage === "string") {
            const aiChat = await Chat.create({
                fuse: aiMessage,
                room: room._id,
                sender: room.AI_MODEL,
            })
            room.chatfuses.push(aiChat._id)

            if (!room.isPrivate)
                await Activity.create({
                    action: randomActivityAction(),
                    message: chat.fuse,
                    sender: room.AI_MODEL,
                    room: room._id,
                })
            const data = (await aiChat.populate("sender")).toJSON()
            return res.status(200).send({
                chat: data,
                success: true,
            })
        }
    }

    res.status(200).send({ success: false })
}

const activityActions = [
    "Sent a message in",
    "Posted in",
    "Responded in",
    "Added a comment in",
    "Contributed to",
    "Shared a post in",
    "Replied to a message in",
    "Commented on a post in",
]

const randomActivityAction = () =>
    activityActions[Math.floor(Math.random() * activityActions.length)]
