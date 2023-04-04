import styles from "./styles.module.css"
import FuseChat from "./chat"
import Members from "./members"
import Link from "next/link"
import { useEffect, useLayoutEffect, useState } from "react"
import { useSession } from "next-auth/react"

import SocketIOClient from "socket.io-client"
import { useRouter } from "next/router"
import axios from "axios"
import Image from "next/image"
import Popup from "../UI/Popup"

export default function Room({ data }) {
    const [room, setRoom] = useState(data)
    const [socket, setSocket] = useState(null)
    const [notifyLimitations, setNotifyLimitations] = useState(null)

    const session = useSession()
    const router = useRouter()

    useEffect(() => {
        if (!room.isPrivate) {
            socketInitializer()
            return () => socket?.disconnect()
        }
    }, [room])

    useLayoutEffect(() => {
        const notified = localStorage.getItem("group-chat-notified")
        if (
            !!(notified !== room.slug) &&
            !!session.data?.user &&
            !room.isPrivate
        ) {
            setNotifyLimitations(
                <div className="block w-full h-full">
                    <h3 className="font-bold text-lg text-center">
                        Page Refresh Required for Updates <br /> in a{" "}
                        <strong className="text-sky-500">Public</strong>{" "}
                        {"chatrooms"}
                    </h3>
                    <p className="py-2 text-center">
                        We apologize for the inconvenience, but this page does
                        not update automatically because the hosting
                        platform&apos;s free tier does not include a web socket
                        service.
                    </p>
                    <ul className="w-full font-semibold flex flex-col gap-2 text-sm p-0 m-0">
                        <li className="leading-none  p-0 m-0">
                            You&apos;ll need to manually refresh this page to
                            check for updates.
                        </li>
                        <li className="leading-none  p-0 m-0">
                            To experience life updates, create a new{" "}
                            <strong className="text-sky-500">Private </strong>{" "}
                            chatroom
                        </li>
                    </ul>
                    <p className="py-4 text-center">
                        Thank you for your understanding and patience.
                    </p>
                </div>,
            )
        }
    }, [room])

    const socketInitializer = async () => {
        const _socket = SocketIOClient.connect(process.env.BASE_URL, {
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
                    const user = session.data.user
                    setRoom((prev) => {
                        return {
                            ...prev,
                            members: [...prev.members, user],
                        }
                    })
                    socket.emit("join-fuse", room.slug, user._id, socket.id)
                } else {
                    const user = session.data.user
                    const members = room.members.filter(
                        (member) => member._id !== user._id,
                    )
                    socket.emit("enjoin-fuse", room.slug, user._id)
                    setRoom((prev) => ({ ...prev, members }))
                }
            })
            .catch((err) => {
                throw new Error(err.message)
            })
    }

    return (
        <div
            style={styles}
            className="flex justify-center w-full gap-[.2em] lg:gap-[.5em]"
        >
            {/* ?  Heading  */}
            {notifyLimitations && (
                <Popup
                    content={notifyLimitations}
                    onConfirm={() => {
                        localStorage.setItem("group-chat-notified", room.slug)
                        setNotifyLimitations(null)
                    }}
                    onClose={() => {
                        setNotifyLimitations(null)
                    }}
                />
            )}
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
                                        if (
                                            room.host._id ===
                                            session.data?.user._id
                                        )
                                            return ""

                                        const isMember = room.members.find(
                                            (user) => {
                                                return (
                                                    user._id ===
                                                    session.data?.user?._id
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
                )}
                <div className="pt-2 pb-0 sm:px-4 px-2">
                    <FuseChat socket={socket} room={room} roomId={room._id} />
                </div>
            </div>
            {!room.isPrivate && (
                <Members socket={socket} room={room} roomId={room._id} />
            )}
        </div>
    )
}
