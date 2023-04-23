import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import ChatCollections from "./ChatCollections"
import Textarea from "./Textarea"
import { useSession } from "next-auth/react"
import axios from "axios"
import { create } from "../../../../server/mongodb/collections/users"
import Input from "./Input"
import { useRouter } from "next/router"

let AUTH_USER_IS_REFERER

function handleSocketEvents(socket, updateFuses, incomingMsgSound) {
    if (!socket) return
    socket.on("chatvite", (chat) => {
        incomingMsgSound.play()
        updateFuses(chat)
    })
    // socket.on("chatvite-ai", (chat) => updateFuses(chat))
}

const queuedUnsentMessages = []
let AutoScroll = true
let cachedMessages
let privateRoomAiResponseTimeout

export default function ChatVite({ socket, room, roomId }) {
    const outgoingMsgSound = new Audio("/audio/msg-outgoing.mp3")
    outgoingMsgSound.volume = 0.4
    const incomingMsgSound = new Audio("/audio/msg-incoming.mp3")
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
    }, [inputOffset])

    useEffect(() => {
        if (!room.isPrivate)
            handleSocketEvents(socket, updateMessages, incomingMsgSound)
        return () => {
            socket?.off("chatvite", () => {})
        }
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
            // createdAt: new Date().toUTCString(),
        }
        updateMessages(data)

        return data
    }

    async function createChat(
        message,
        callback,
        display = true,
        resendElement,
        chatObject,
    ) {
        // Todo --> check membership before creating message
        // socket.emit("add-group-member", room.slug, user, socket.id)

        if (!session.data?.user._id) {
            router.push("/auth/login")
            return
        }
        let chat

        if (display) {
            chat = displayChat(message)
        }

        callback()

        try {
            outgoingMsgSound.play()

            const { data, statusText } = await axios.post(
                "/api/room/chat",
                {
                    chat: message,
                    roomId,
                    slug: room.slug,
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                    timeout: 30000,
                },
            )
            if (data._id) {
                if (display) {
                    AutoScroll = true
                    updateIndividualChat(chat, data)
                } else {
                    AutoScroll = false
                    updateIndividualChat(chatObject, data)
                }
                callback()
            }
            if (room.isPrivate) {
                const last_chat = data[0]
                setMessages((prev) => {
                    if (display) prev.pop()
                    let _data = [...prev, last_chat]
                    return _data
                })

                if (privateRoomAiResponseTimeout)
                    clearTimeout(privateRoomAiResponseTimeout)

                privateRoomAiResponseTimeout = setTimeout(() => {
                    incomingMsgSound.play()
                    setMessages((prev) => {
                        if (display) prev.pop()
                        let _data = [...prev, last_chat, data[1]]
                        return _data
                    })
                }, 1500)
                callback()
            } else {
                socket.emit("new-chat", room.slug, data)
            }
        } catch (err) {
            console.error(err.response?.data.message || err.message)
            handleFailedMessageResubmission(
                message,
                callback,
                resendElement,
                chat,
            )
        }
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
        if (queuedUnsentMessages.includes(resendButton.id)) return

        resendButton.id = resendButton.id || Date.now().toString()
        queuedUnsentMessages.push(resendButton.id)

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
                className=" overflow-hidden overflow-y-auto p-1 sm:p-2"
            >
                <ChatCollections fuses={messages} />
            </div>
            <div className=" min-h-[48px] py-2 items-center flex w-full bg-gray-700">
                <Input onSubmit={createChat} setOffset={setInputOffset} />
            </div>
        </div>
    )
}
