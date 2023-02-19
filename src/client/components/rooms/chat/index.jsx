import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import ChatCollections from "./ChatCollections"
import Textarea from "./Textarea"
import { useSession } from "next-auth/react"

function handleSocketEvents(socket, updateFuses, room) {
    socket.on("fusechat", (chat) => {
        updateFuses(chat)
    })
    socket.on("fusechat-ai", (chat) => {
        updateFuses(chat)
    })
}

export default function FuseChat({ socket, room, roomId }) {
    const chatContainerRef = useRef()

    const [fuses, setFuses] = useState(room.chatfuses || [])

    const session = useSession()

    useLayoutEffect(() => {
        const container = chatContainerRef.current
        const containerPosition = container.getBoundingClientRect().y
        const screenHeight = window.innerHeight

        const height = screenHeight - containerPosition
        const offset = 70
        container.style.setProperty("--chat-height", `${height - offset}px`)
    }, [])

    useEffect(() => {
        handleSocketEvents(socket, updateFuses, room)
        if (socket) return () => socket.disconnect()
    }, [])

    useLayoutEffect(() => {
        const lastFuse = chatContainerRef.current?.querySelector(
            "[data-fuse-collections] [data-last-target]",
        )

        if (lastFuse) {
            lastFuse.scrollIntoView({ behavior: "smooth" })
        }
    }, [fuses])

    function updateFuses(data) {
        setFuses((prev) => {
            return [...prev, data]
        })
    }

    function handleFuseSubmit(fuse, callback) {
        callback()
        // updateFuses(fakeFuse(fuse, session.data?.user))

        fetch("/api/room/chat", {
            method: "post",
            body: JSON.stringify({ fuse, roomId }),
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.fuse) {
                    // updateFuses(data.fuse)
                }
            })
            .catch((err) => {
                const lastFuse = [
                    ...chatContainerRef.current?.querySelectorAll(
                        "[data-fuse-collections] [data-fuse-chat]",
                    ),
                ].reverse()[0]

                if (lastFuse) {
                    lastFuse.classList.add("unsent")
                }
            })
    }

    return (
        <div className="bg-gray-800 rounded-md overflow-hidden relative">
            <div
                style={{
                    height: "var(--chat-height)",
                    boxShadow: "inset 0 0 15px 1px rgba(0,0,0,.2)",
                }}
                ref={chatContainerRef}
                className=" overflow-hidden overflow-y-auto p-2"
            >
                <ChatCollections fuses={fuses} />
            </div>
            <div className="mt-[1px] flex h-[60px]">
                <Textarea onSubmit={handleFuseSubmit} />
            </div>
        </div>
    )
}
