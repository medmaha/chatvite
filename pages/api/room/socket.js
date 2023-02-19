import { Server as ServerIO } from "socket.io"
import connectToDatabase from "../../../src/server/db"
import { User, Room, Chat } from "../../../src/server/mongodb/collections"
import {
    promptHeader,
    buildPromptBody,
    getChatGPTResponse,
} from "../../../src/server/chatGPT"

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function ConnectSocket(req, res) {
    if (!res.socket?.server?.io) {
        const httpServer = res.socket.server
        const io = new ServerIO(httpServer, {
            path: "/api/room/socket",
            cors: { origin: [process.env.BASE_URL] },
        })

        res.socket.server.io = io

        io.on("connection", (socket) => {
            socket.on("fuse-group", (roomName) => {
                socket.join(roomName)
            })

            socket.on("disconnect", (socket) => {
                console.log("[New Disconnection]", socket?.id)
            })

            socket.on("join-fuse", (fuseGroup, user_id, socket_id) => {
                unSubscribe(fuseGroup, user_id, socket, "add")
                createAIResponse(fuseGroup, null, user_id, socket_id, io)
            })
            socket.on("enjoin-fuse", (slug, user_id) => {
                unSubscribe(slug, user_id, socket, "remove")
            })
        })
    }
    res.end()
}

async function unSubscribe(slug, user_id, socket, action) {
    await connectToDatabase()

    const room = await Room.findOne({ slug })
    const user = await User.findById(user_id)

    if (user && room) {
        socket.to(room.slug).emit("member-" + action, {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            username: user.username,
        })
    }
}

async function createAIResponse(slug, fuse, user_id, socket_id, socketIO) {
    await connectToDatabase()

    const room = await Room.findOne({ slug })
    const user = await User.findById(user_id)

    if (room && user) {
        let prompt = buildPromptBody(fuse, room, null, true)
        let introduction = `A new member just join the group chat username="${user.username}"\nIntroduce yourself to the new member and explain the whole essence of the to him/her\n also remind him/her to be ethical with chat's\nAI:`
        prompt += introduction

        if (prompt !== "no-need") {
            const aiResponse = await getChatGPTResponse(prompt)
            if (typeof aiResponse === "string") {
                // const chat = await Chat.create({
                //     fuse: aiResponse,
                //     room: room.id,
                //     sender: {
                //         id: room.AI_MODEL.id,
                //         name: room.AI_MODEL.name,
                //         username: room.AI_MODEL.username,
                //         avatar: room.AI_MODEL.avatar,
                //     },
                // })
                // room.chatfuses.push({
                //     id: chat.id,
                //     fuse: chat.fuse,
                //     room: chat.room,
                //     sender: chat.sender,
                // })
                // await room.save()
                const chat = {
                    id: Date.now().toString(),
                    fuse: aiResponse,
                    room: room.id,
                    sender: {
                        id: room.AI_MODEL.id,
                        name: room.AI_MODEL.name,
                        username: room.AI_MODEL.username,
                        avatar: room.AI_MODEL.avatar,
                    },
                }

                socketIO.to(socket_id).emit("fusechat-ai", {
                    id: user.id,
                    fuse: chat.fuse,
                    room: chat.room,
                    sender: chat.sender,
                })
            }
        }
    }
}
