import { Server } from "socket.io"

export default async function SocketHandler(req, res) {
    if (res.socket.server.io) {
        res.end()
        return
    }

    const io = new Server(res.socket.server, {
        path: "/api/room/socket",
        cors: { origin: ["http://localhost:3000"] },
    })
    res.socket.server.io = io

    io.on("connection", (socket) => {
        console.log("connected -->", socket.id)
    })

    res.end()
}
