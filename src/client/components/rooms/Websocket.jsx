import React, {
    useCallback,
    useContext,
    createContext,
    useEffect,
    useState,
} from "react"
import SocketIOClient from "socket.io-client"

const ChatRoomWebsocketContext = createContext({ socket: null })

export default function RoomWebsocketProvider({ user, room, children }) {
    const [socket, setSocket] = useState(null)

    const socketConnection = useCallback(
        (path) => {
            // if (!user) return
            const _socket = SocketIOClient(process.env.WEBSOCKET_URL, {
                // path,
                // retries: 3,
                // reconnectionAttempts: 3,
            })

            _socket.on("connect", () => {
                _socket.emit("join", room.slug, user?._id)

                _socket.on("joined", () => {
                    setSocket(_socket)
                })

                let retry = 0
                _socket.on("disconnect", (reason) => {
                    _socket.off("joined")
                    _socket.off("add-subscription")
                    _socket.off("del-subscription")
                    if (reason === "io server disconnect") {
                        retry++
                        if (retry !== 3) _socket.connect()
                    }
                    setSocket(null)
                })
            })
        },
        [room.slug, user],
    )

    useEffect(() => {
        if (!socket?.connected) socketConnection()
        return () => {
            socket?.disconnect()
        }
    }, [socket, socketConnection])

    return (
        <ChatRoomWebsocketContext.Provider value={{ socket }}>
            {children}
        </ChatRoomWebsocketContext.Provider>
    )
}

export function useChatWebsocket() {
    const context = useContext(ChatRoomWebsocketContext)

    return context
}
