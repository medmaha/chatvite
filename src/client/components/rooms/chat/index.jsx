import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    useMemo,
    useCallback,
} from "react"
import ChatCollections from "./ChatCollections"
import { useSession } from "next-auth/react"
import axios from "axios"
import Input from "./Input"
import { useRouter } from "next/router"
import Popup from "../../UI/Popup"
import Pending from "../../UI/Pending"
import Meta from "../../../contexts/Meta"
import { useChatWebsocket } from "../Websocket"

const queuedUnsentMessages = []
let cachedMessages
let privateRoomAiResponseTimeout

let AutoScroll = true

// prettier-ignore
export default function ChatVite({  room, roomId, joinChatRoom, isMember }) {
    const outgoingMsgSound = useMemo(() => {
        const sound = new Audio("/audio/msg-outgoing.mp3")
        sound.volume = 0.6
        return sound
    }, [])

    const {socket} = useChatWebsocket()

    const incomingMsgSound = useMemo(
        () => new Audio("/audio/msg-incoming.mp3"),
        [],
    )
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
    }, [inputOffset])

    useEffect(() => {
        setMessages(room.chatfuses)
    }, [room])

    useEffect(() => {
        const update = (chat) => {
            incomingMsgSound.play()
            setMessages((prev) => [...prev, chat])
        }

        socket?.on("chat", update) 
      

        return () => {
            socket?.off("chat", update)
        }
    }, [room, socket, incomingMsgSound])

    const scrollToBottom = useCallback(
        function () {
            if (!Boolean(messages.length)) return
            const element = chatContainerRef.current

            // element.scrollTop = -element.screenHeight
            // element.scrollTo(0, 500)

            if (element && AutoScroll) {
                // const maxScrollTop = element.firstChild.clientHeight

                element.scrollTo({
                    behavior: "smooth",
                    top: 5000,
                })
            }
        },
        [messages],
    )

    useEffect(() => {
        const messageRenderingDelay = setTimeout(() => {
            scrollToBottom()
        }, 300)
        cachedMessages = messages

        return () => {
            clearTimeout(messageRenderingDelay)
        }
    }, [messages, scrollToBottom])

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
        return data
    }

    // prettier-ignore
    async function createChat(message, callback, display = true, resendElement, chatObject) {
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
            outgoingMsgSound.play()

            const { data } = await axios.post(
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
          
             if (socket?.connected) {
                 socket.emit("chat", room.slug, data)
             }
             if (display) {
                 AutoScroll = true
                 updateIndividualChat(chat, data)
             } else {
                 AutoScroll = false
                 updateIndividualChat(chatObject, data)
             }
             callback()
            
        } catch (err) {
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
                            joinChatRoom(null, () => {
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
