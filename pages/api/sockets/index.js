import { Server } from "socket.io"

export default async function SocketHandler(req, res) {
    if (res.socket.server.io) {
        res.end()
        return
    }

    const io = new Server(res.socket.server, {
        cors: { origin: ["http://localhost:3000"] },
    })
    res.socket.server.io = io

    io.on("connection", (socket) => {
        console.log("connected -->", socket.id)
        io.on("message", (msg) => {
            console.log(msg)
            io.send(msg)
        })
        io.on("fuse", (msg) => {
            io.broadcast.emit("fuse-chat", msg)
            console.log(msg)
        })
    })

    res.end()
}
