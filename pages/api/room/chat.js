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
    const { fuse, roomId } = JSON.parse(req.body)

    const user = await Authenticate(req, res)

    const room = await Room.findById(roomId)

    if (!user) {
        return Promise.resolve()
    }
    if (!room) {
        res.status(400).json({ message: "Bad request" })
        res.end()
        return Promise.resolve()
    }

    const chat = await Chat.create({
        fuse,
        room: room.id,
        sender: {
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
        },
    })

    room.chatfuses.push({
        id: chat.id,
        fuse: chat.fuse,
        room: chat.room,
        sender: chat.sender,
    })

    await room.save()

    const activity = await Activity.create({
        action: "Replied in",
        message: chat.fuse,
        sender: {
            id: chat.sender.id,
            name: chat.sender.name,
            avatar: chat.sender.avatar,
            username: chat.sender.username,
        },
        room: {
            id: room.id,
            slug: room.slug,
            name: room.name,
            host: {
                id: room.host.id,
                name: room.host.name,
                avatar: room.host.avatar,
                username: room.host.username,
            },
            topic: {
                id: room.topic.id,
                name: room.topic.name,
                slug: room.topic.slug,
            },
        },
    })

    await activity.save()

    const socketIO = res?.socket?.server?.io || null

    if (socketIO) {
        socketIO.to(room.slug).emit("fusechat", {
            id: chat.id,
            fuse: chat.fuse,
            room: chat.room,
            sender: chat.sender,
        })
        createAIResponse(room.slug, fuse, user, socketIO)
    }

    res.status(200).json({
        fuse: !!socketIO,
    })
}

async function createAIResponse(slug, fuse, user, socketIO) {
    const room = await Room.findOne({ slug })

    if (room) {
        const prompt = buildPromptBody(fuse, room, user)
        if (prompt !== "no-need") {
            const aiResponse = await getChatGPTResponse(prompt)
            if (typeof aiResponse === "string") {
                const chat = await Chat.create({
                    fuse: aiResponse,
                    room: room.id,
                    sender: {
                        id: room.AI_MODEL.id,
                        name: room.AI_MODEL.name,
                        username: room.AI_MODEL.username,
                        avatar: room.AI_MODEL.avatar,
                    },
                })
                room.chatfuses.push({
                    id: chat.id,
                    fuse: chat.fuse,
                    room: chat.room,
                    sender: chat.sender,
                })
                await room.save()

                socketIO.to(slug).emit("fusechat-ai", {
                    id: chat.id,
                    fuse: chat.fuse,
                    room: chat.room,
                    sender: chat.sender,
                })
                const activity = await Activity.create({
                    action: "Replied in",
                    message: chat.fuse,
                    sender: {
                        id: chat.sender.id,
                        name: chat.sender.name,
                        avatar: chat.sender.avatar,
                        username: chat.sender.username,
                    },
                    room: {
                        id: room.id,
                        slug: room.slug,
                        name: room.name,
                        host: {
                            id: room.host.id,
                            name: room.host.name,
                            avatar: room.host.avatar,
                            username: room.host.username,
                        },
                        topic: {
                            id: room.topic.id,
                            name: room.topic.name,
                            slug: room.topic.slug,
                        },
                    },
                })

                await activity.save()
            }
        }
    }
}
