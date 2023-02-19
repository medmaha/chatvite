import styles from "./styles.module.css"
import FuseChat from "./chat"
import Members from "./members"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import SocketIOClient from "socket.io-client"
import { useRouter } from "next/router"

export default function Room({ data }) {
    const [room, setRoom] = useState(data)
    const [socket, setSocket] = useState(null)

    const session = useSession()
    const router = useRouter()

    useEffect(() => {
        socketInitializer()
        return () => socket?.disconnect()
    }, [])

    async function fetchRoom() {
        fetch("/api/room/" + room.slug, { method: "get" })
            .then((res) => res.json())
            .then((data) => setRoom(room))
            .catch((err) => {})
    }

    const socketInitializer = async () => {
        // await fetch("/api/room/socket")

        const _socket = SocketIOClient.connect("http://localhost:3000", {
            path: "/api/room/socket",
        })

        _socket.on("connect", () => {
            _socket.emit("fuse-group", room.slug)

            // _socket.on("enjoin-fuse", room.slug)

            setSocket(_socket)
        })
    }

    function joinFuseGroup() {
        if (!session?.data?.user) {
            router.push("/auth/login")
            return
        }
        fetch("/api/room/join", {
            method: "post",
            credentials: "include",
            body: JSON.stringify({ id: room._id }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!!data.joined) {
                    const user = session.data.user
                    setRoom((prev) => {
                        return {
                            ...prev,
                            members: [...prev.members, user],
                        }
                    })
                    socket.emit("join-fuse", room.slug, user.id, socket.id)
                } else {
                    const user = session.data.user
                    const members = room.members.filter(
                        (member) => member.id !== user.id,
                    )
                    socket.emit("enjoin-fuse", room.slug, user.id)
                    setRoom((prev) => ({ ...prev, members }))
                }
            })
            .catch((err) => {
                throw Error(err.message)
            })
    }

    if (!socket) return <></>

    return (
        <div
            style={styles}
            className="flex w-full pt-2 gap-[.2em] lg:gap-[.5em]"
        >
            {/* ?  Heading  */}
            <div className="flex-1 bg-gray-700 rounded-sm overflow-hidden">
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
                        <button className="text-[1em] sm:text-[1.25em] lg:text-[1.75em] font-bold tracking-wider transition hover:text-sky-400">
                            {room.name}
                        </button>
                    </h2>
                    <div className="flex ml-[.2em] flex-1 justify-end truncate">
                        <button
                            title={room.topic.name}
                            className="tracking-wide border border-transparent truncate p-[.5em] lg:p-[.75em] text-sm md:text-base rounded-full transition-[color,border] bg-gray-800 text-gray-300 hover:text-blue-400 hover:border-blue-400 hover:border-[1px]"
                        >
                            {room.topic.name}
                        </button>
                    </div>
                </div>
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
                            <button className="user w-[50px] h-[50px] rounded-full bg-gray-800 border-solid border-blue-400 border-[1px]">
                                <span></span>
                            </button>
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                            <div className="inline-flex flex-col justify-start leading-none">
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
                            </div>
                            <div className="mr-4 transition">
                                {(() => {
                                    if (
                                        (room.host.id || room.host._id) ===
                                        session.data?.user.id
                                    )
                                        return ""

                                    const isMember = room.members.find(
                                        (user) => {
                                            return (
                                                user.id ===
                                                session.data?.user?.id
                                            )
                                        },
                                    )

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
                                                join
                                            </span>
                                        </button>
                                    )
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-2 px-4">
                    <FuseChat socket={socket} room={room} roomId={room._id} />
                </div>
            </div>
            <div className="flex-1 max-w-[280px] lg:max-w-[350px] bg-gray-700 hidden md:block">
                <Members socket={socket} room={room} roomId={room._id} />
            </div>
        </div>
    )
}
