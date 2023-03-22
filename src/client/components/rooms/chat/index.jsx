import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import ChatCollections from "./ChatCollections"
import Textarea from "./Textarea"
import { useSession } from "next-auth/react"
import axios from "axios"
import { create } from "../../../../server/mongodb/collections/users"
import Input from "./Input"
import { useRouter } from "next/router"

let AUTH_USER

function handleSocketEvents(socket, updateFuses) {
    if (!socket) return
    socket.on("fusechat", (chat) => {
        if (AUTH_USER) {
            AUTH_USER = false
            return
        }
        updateFuses(chat)
    })
    socket.on("fusechat-ai", (chat) => {
        updateFuses(chat)
    })
}

const queuedResendEvents = []
let AutoScroll = true
let cachedMessages

export default function ChatVite({ socket, room, roomId }) {
    const chatContainerRef = useRef()

    const [messages, setMessages] = useState(room.chatfuses || [])
    const [inputOffset, setInputOffset] = useState(0)

    const session = useSession()
    const router = useRouter()

    useLayoutEffect(() => {
        const container = chatContainerRef.current
        const containerPosition = container.getBoundingClientRect().y
        const screenHeight = window.innerHeight

        const height = screenHeight - containerPosition
        const offset = inputOffset
        container.style.setProperty("--chat-height", `${height - offset - 5}px`)

        console.log("inputOffset: ", inputOffset)
        console.log("offset:", offset)
    }, [inputOffset])

    useEffect(() => {
        handleSocketEvents(socket, updateMessages)
    }, [socket])

    useLayoutEffect(() => {
        const lastFuse = chatContainerRef.current?.querySelector(
            "[data-fuse-collections] [data-last-target]",
        )

        if (lastFuse && AutoScroll) {
            lastFuse.scrollIntoView({ behavior: "smooth" })
        }
        cachedMessages = messages
    }, [messages, inputOffset])

    function updateMessages(data) {
        AutoScroll = true

        let idx
        setMessages((prev) => {
            let _data = [...prev, data]
            idx = _data.length - 1
            return _data
        })
        return idx
    }

    function displayChat(chat) {
        const data = {
            _id: Math.random().toString(36).substring(2, 15),
            fuse: chat,
            room: room._id,
            sender: {
                ...session.data?.user,
                _id: session.data?.user._id,
            },
        }
        updateMessages(data)
        AUTH_USER = true
        return data
    }

    function createChat(
        message,
        callback,
        display = true,
        resendElement,
        chatObject,
    ) {
        if (!session.data?.user._id) {
            router.push("/auth/login")
            return
        }
        let chat
        AUTH_USER = true

        if (display) chat = displayChat(message)

        callback()

        axios
            .post(
                "/api/room/chat",
                {
                    fuse: message,
                    roomId,
                    slug: room.slug,
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                    timeout: 30000,
                },
            )
            .then((res) => {
                if (res.data._id) {
                    if (display) updateIndividualChat(chat, res.data)
                    else {
                        AutoScroll = false
                        updateIndividualChat(chatObject, res._data)
                    }
                }
                if (room.isPrivate) {
                    setMessages((prev) => {
                        if (display) prev.pop()
                        let _data = [...prev, ...res.data]
                        return _data
                    })
                    // let idx = 0
                    // for (const msg of res.data) {
                    //     if (idx === 0 && display)
                    //         updateIndividualChat(msg, res.data)
                    //     else {
                    //         updateMessages(msg)
                    //     }
                    //     idx++
                    // }
                }
            })
            .catch((err) => {
                console.error(err.response?.data.message || err.message)
                handleFailedMessageResubmission(
                    message,
                    callback,
                    resendElement,
                    chat,
                )
            })
    }

    function updateIndividualChat(chat, data) {
        let msgs = [...cachedMessages]
        const chatIdx = msgs.findIndex((msg) => msg._id === chat._id)

        const message = { ...chat, ...data }

        msgs[chatIdx] = message

        setMessages([...msgs])
    }

    function handleFailedMessageResubmission(
        message,
        callback,
        resendElement,
        chatObject,
    ) {
        function getLastMessage() {
            let lastChat
            if (resendElement) {
                lastChat = resendElement
            } else {
                lastChat = [
                    ...chatContainerRef.current?.querySelectorAll(
                        "[data-fuse-collections] [data-fuse-chat]",
                    ),
                ].reverse()[0]
            }
            const resendButton = lastChat.querySelector(
                "[data-fuse-failed] button",
            )
            return [lastChat, resendButton]
        }

        const [lastChat, resendButton] = getLastMessage()

        lastChat.classList.add("unsent")
        if (queuedResendEvents.includes(resendButton.id)) return

        resendButton.id = resendButton.id || Date.now().toString()
        queuedResendEvents.push(resendButton.id)

        resendButton.addEventListener("click", () => {
            lastChat.classList.remove("unsent")
            createChat(message, callback, false, lastChat, chatObject)
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
                <ChatCollections fuses={messages} />
            </div>
            <div className=" min-h-[48px] py-2 items-center flex w-full bg-gray-700">
                <Input onSubmit={createChat} setOffset={setInputOffset} />
            </div>
        </div>
    )
}
