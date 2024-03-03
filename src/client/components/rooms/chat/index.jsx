import React, {
    Children,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react"
import ChatCollections from "./ChatCollections"
import Textarea from "./Textarea"
import { useSession } from "next-auth/react"
import axios from "axios"
import { create } from "../../../../server/mongodb/collections/users"
import Input from "./Input"
import { useRouter } from "next/router"
import Popup from "../../UI/Popup"
import Pending from "../../UI/Pending"
import Meta from "../../../contexts/Meta"

const queuedUnsentMessages = []
let AutoScroll = true
let cachedMessages
let privateRoomAiResponseTimeout

let messageRenderingDelay

export default function ChatVite({
    socket,
    room,
    roomId,
    joinFuseGroup,
    isMember,
}) {
    const outgoingMsgSound = new Audio("/audio/msg-outgoing.mp3")
    outgoingMsgSound.volume = 0.6
    const incomingMsgSound = new Audio("/audio/msg-incoming.mp3")
    const chatContainerRef = useRef()

    const [messages, setMessages] = useState([])
    const [inputOffset, setInputOffset] = useState(0)
    const [membershipPopup, toggleMembershipPopup] = useState(false)

    const session = useSession()
    const router = useRouter()

    useLayoutEffect(() => {
        if (inputOffset > 1) {
            const container = chatContainerRef.current
            const containerPosition = container.getBoundingClientRect().y
            const screenHeight = window.innerHeight

            const height = screenHeight - containerPosition
            const offset = inputOffset
            container.style.setProperty(
                "--chat-height",
                `${height - offset - 5}px`,
            )
        }
        // scrollToBottom()
    }, [inputOffset])

    useEffect(() => {
        setMessages(room.chatfuses)
    }, [room])

    useEffect(() => {
        messageRenderingDelay = setTimeout(() => {
            scrollToBottom()
        }, 300)
        cachedMessages = messages

        return () => {
            clearTimeout(messageRenderingDelay)
        }
    }, [messages])

    useEffect(() => {
        if (!room.isPrivate && socket) {
            socket?.on("chatvite", (chat) => {
                incomingMsgSound.play()
                updateMessages(chat)
            })
            socket?.on("chatvite-ai", (chat) => {
                incomingMsgSound.play()
                updateMessages(chat)
            })
        }
        return () => {
            socket?.off("chatvite", () => {})
            socket?.off("chatvite-ai", () => {})
        }
    }, [socket])

    function scrollToBottom() {
        if (!Boolean(messages.length)) return
        const element = chatContainerRef.current

        // element.scrollTop = -element.screenHeight
        // element.scrollTo(0, 500)

        if (element) {
            // const maxScrollTop = element.firstChild.clientHeight

            element.scrollTo({
                behavior: "smooth",
                top: 5000,
            })
        }
    }

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
        if (!message?.length) return

        const _userId = session.data?.user._id

        if (!_userId) {
            return router.push("/auth/login")
        }

        if (!room.isPrivate) {
            if (room.host._id !== _userId && !isMember)
                return toggleMembershipPopup(true)
        }

        let chat
        if (display) {
            chat = displayChat(message)
        }

        callback()

        try {
            if (room.isPrivate) outgoingMsgSound.play()

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
                const aiChat = data[1]

                setMessages((prev) => {
                    if (display) prev.pop()
                    let _data = [...prev, last_chat]
                    return _data
                })

                if (privateRoomAiResponseTimeout) {
                    clearTimeout(privateRoomAiResponseTimeout)
                }
                if (aiChat)
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
                outgoingMsgSound.play()
                if (socket) socket.emit("new-chat", room.slug, data)
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
                ]?.reverse()[0]
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
        <>
            <Meta>
                <title>Room - {room.name} | Chatvite</title>
            </Meta>
            <div className="bg-gray-800 rounded-md overflow-hidden relative">
                {membershipPopup && (
                    <Popup
                        content={
                            <>
                                You must subscribe to this chatroom first,
                                before you create a chat
                            </>
                        }
                        confirmBtnText={"Subscribe"}
                        onClose={() => {
                            toggleMembershipPopup(false)
                        }}
                        onConfirm={(config, cb) => {
                            joinFuseGroup(null, () => {
                                toggleMembershipPopup(false)
                            })

                            cb({
                                ...config,
                                content: <Pending h="250px" />,
                            })
                        }}
                    />
                )}
                <div
                    style={{
                        height: "var(--chat-height)",
                        boxShadow: "inset 0 0 15px 1px rgba(0,0,0,.2)",
                    }}
                    ref={chatContainerRef}
                    className="overflow-hidden overflow-y-auto p-1 sm:p-2"
                >
                    <ChatCollections fuses={messages} />
                </div>
                <div className="min-h-[48px] py-2 items-center flex w-full bg-gray-700">
                    <Input onSubmit={createChat} setOffset={setInputOffset} />
                </div>
            </div>
        </>
    )
}
