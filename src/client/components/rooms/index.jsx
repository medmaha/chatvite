import styles from "./styles.module.css"
import ChatVite from "./chat"
import Members from "./members"
import Link from "next/link"
import {
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useState,
} from "react"
import { useSession } from "next-auth/react"

import SocketIOClient from "socket.io-client"
import { useRouter } from "next/router"
import axios from "axios"
import Image from "next/image"
import Popup from "../UI/Popup"
import { GlobalContext } from "../../contexts"

export default function Room({ data, WEBSOCKET_URL }) {
    const [roomResponseData, setRoomResponseData] = useState(data)
    const [room, setRoom] = useState(data)
    const [socket, setSocket] = useState(null)
    const [isMember, setIsMember] = useState(false)
    const { user, newAlertEmit } = useContext(GlobalContext)

    const router = useRouter()

    const socketInitializer = useCallback(async () => {
        const _socket = SocketIOClient(process.env.WEBSOCKET_URL)

        _socket.on("connect", () => {
            console.log("ws connected")
            _socket.emit("subscribe-group", room.slug)

            _socket.on("subscribed", () => setSocket(_socket))

            _socket.on("disconnect", (reason) => {
                if (reason === "io server disconnect") {
                    _socket.connect()
                    setSocket(null)
                } else setSocket(null)
                console.log("ws disconnected [" + reason + "]")
            })
        })
    }, [room.slug])

    useEffect(() => {
        if (!room.isPrivate && !socket) {
            socketInitializer()
        }
        return () => {
            socket?.off("connect")
            socket?.off("subscribed")
            socket?.off("disconnect")
            socket?.disconnect()
        }
    }, [room.isPrivate, socket, socketInitializer])

    function joinFuseGroup(ev, callback) {
        if (!user) {
            router.push("/auth/login")
            return
        }

        axios
            .post(
                "/api/room/join",
                { id: room._id },
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                const data = res.data
                if (!!data.joined) {
                    socket.emit("add-group-member", room.slug, user, socket.id)

                    const CustomEventEmitter = new CustomEvent(
                        "member-subscription",
                        { detail: { type: "add", data: user } },
                    )
                    document.dispatchEvent(CustomEventEmitter)
                    // setRoom({
                    //     ...room,
                    //     members: [user],
                    // })
                } else {
                    socket.emit("remove-group-member", room.slug, user.id)

                    const CustomEventEmitter = new CustomEvent(
                        "member-subscription",
                        { detail: { type: "remove", data: user } },
                    )
                    document.dispatchEvent(CustomEventEmitter)
                    // setRoom((prev) => {
                    //     return {
                    //         ...room,
                    //         members: prev.members?.filter(
                    //             (_usr) => _usr._id !== user._id,
                    //         ),
                    //     }
                    // })
                }
            })
            .catch((err) => {
                throw new Error(err.message)
            })
            .finally(() => {
                if (callback) callback()
            })
    }

    return (
        <div
            style={styles}
            className="flex justify-center w-full gap-[.2em] lg:gap-[.5em]"
        >
            {/* ?  Heading  */}

            <div className="flex-1 max-w-[850px] rounded-t-lg sm:rounded-t-xl bg-gray-700 rounded-b-sm overflow-hidden">
                <div className="header px-[.5em] py-[.5em] lg:py-[.75em] flex items-center h-max bg-gray-600">
                    <div className="mr-[.5em] lg:mr-[1em] px-[.5em]">
                        <button
                            className="leading-none hover:text-blue-500 transition"
                            title="Back"
                        >
                            <Link href={"/feed"}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                </svg>
                            </Link>
                        </button>
                    </div>
                    <h2 className="">
                        <button className="text-[1em] sm:text-[1.25em] lg:text-[1.75em] font-bold tracking-wider max-w-[200px] sm:max-w-full truncate">
                            {room.name}
                        </button>
                    </h2>
                    <div className="flex ml-[.2em] flex-1 justify-end truncate">
                        <Link
                            href={`/feed?q=${room.topic.slug}&tid=${room.topic._id}`}
                            title={room.topic.name}
                            className="tracking-wide inline-block border border-transparent truncate p-[.5em] lg:p-[.75em] text-sm md:text-base rounded-full transition-[color,border] bg-gray-800 text-gray-300 hover:text-blue-400 hover:border-blue-400 hover:border-[1px]"
                        >
                            {room.topic.name}
                        </Link>
                    </div>
                </div>
                {!room.isPrivate && (
                    <div className="p-[.75em]">
                        <div className="flex justify-between items-center">
                            <h4 className="text-gray-400 text-sm md:text-base sm:font-semibold pb-[.5em]">
                                HOSTED BY
                            </h4>
                            <div className="inline text-sm text-gray-500">
                                {room.updatedAt}
                            </div>
                        </div>
                        <div className="flex gap-[.5em]" id="">
                            <div className="">
                                <Link
                                    href={`/profile/${room.host.username}`}
                                    className="inline-block w-[52px] h-[52px] rounded-full bg-gray-800 border-solid border-gray-600 border-[1px]"
                                >
                                    <Image
                                        src={room.host.avatar}
                                        width={50}
                                        height={50}
                                        alt="room host"
                                        className="rounded-full"
                                    />
                                </Link>
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                                <Link
                                    href={`/profile/${room.host.username}`}
                                    className="inline-flex flex-col justify-start leading-none"
                                >
                                    <div className="leading-none">
                                        <p className="text-gray-300 p-0 font-semibold leading-none">
                                            {room.host.name || "No Name"}
                                        </p>
                                    </div>
                                    <div className="leading-none">
                                        <button className="text-blue-400 font-semibold text-sm leading-none tracking-wide">
                                            @{room.host.username}
                                        </button>
                                    </div>
                                </Link>
                                <div className="mr-4 transition">
                                    {(() => {
                                        if (!socket) return <></>
                                        if (room.host._id === user?._id)
                                            return ""

                                        if (isMember) {
                                            return (
                                                <button
                                                    onClick={joinFuseGroup}
                                                    className="py-1 px-2 inline-flex gap-1 items-center hover:bg-red-500 transition bg-red-400 font-semibold rounded-2xl"
                                                >
                                                    <span className="capitalize">
                                                        Unsubscribe
                                                    </span>
                                                </button>
                                            )
                                        }
                                        return (
                                            <button
                                                onClick={joinFuseGroup}
                                                className="py-1  px-2 inline-flex gap-1 items-center hover:bg-blue-500 transition bg-blue-400 font-semibold rounded-2xl"
                                            >
                                                <span className="leading-none">
                                                    +
                                                </span>
                                                <span className="capitalize">
                                                    Subscribe
                                                </span>
                                            </button>
                                        )
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="pt-2 pb-0 sm:px-4 px-2">
                    <ChatVite
                        socket={socket}
                        room={room}
                        isMember={isMember}
                        joinFuseGroup={joinFuseGroup}
                        roomId={room._id}
                    />
                </div>
            </div>
            {!room.isPrivate && (
                <Members
                    socket={socket}
                    setRoom={setRoom}
                    roomId={room._id}
                    hostId={room.host._id}
                    setIsMember={setIsMember}
                />
            )}
        </div>
    )
}
