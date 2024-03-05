import styles from "./styles.module.css"
import ChatVite from "./chat"
import Members from "./members"
import Link from "next/link"
import { useContext, useState, useEffect } from "react"

import { useRouter } from "next/router"
import axios from "axios"
import Image from "next/image"
import { GlobalContext } from "../../contexts"
import DateFormatter from "../UI/layouts/DateFormatter"
import MobileMembers from "./members/MobileMembersCollection"
import SubscribeButton from "./Componenets/SubscribeButton"
import { useChatWebsocket } from "./Websocket"

export default function Room({ data }) {
    const [room, setRoom] = useState(data)
    const { socket } = useChatWebsocket()
    const [mobileScreenMembers, toggleMobileScreenMembers] = useState(false)
    const [isMember, setIsMember] = useState(undefined)
    const { user } = useContext(GlobalContext)

    const router = useRouter()

    async function joinChatRoom(ev, callback) {
        if (!user) {
            router.push("/auth/login")
            return false
        }

        try {
            const { data } = await axios.post(
                "/api/room/join",
                { id: room._id },
                {
                    withCredentials: true,
                },
            )
            console.log(data)
            if (!!data.joined) {
                socket.emit("subscribe", room.slug, user)

                const CustomEventEmitter = new CustomEvent(
                    "member-subscription",
                    { detail: { type: "add", data: user } },
                )
                document.dispatchEvent(CustomEventEmitter)
            } else {
                socket.emit("unsubscribe", room.slug, user.id)

                const CustomEventEmitter = new CustomEvent(
                    "member-subscription",
                    { detail: { type: "remove", data: user } },
                )
                document.dispatchEvent(CustomEventEmitter)
            }
            if (callback) callback()
            return true
        } catch (error) {
            if (callback) callback()
            // TODO, notify the user about the error
            return false
        }
    }

    let isPrivateChat = Boolean(room.isPrivate)

    return (
        <div
            style={styles}
            className={`grid ${
                room && !isPrivateChat
                    ? "md:grid-cols-[auto,auto] grid-cols-1"
                    : ""
            } justify-center w-full gap-4`}
        >
            <MobileMembers
                room={room}
                socket={socket}
                setRoom={setRoom}
                setIsMember={setIsMember}
                mobileScreenMembers={mobileScreenMembers}
                toggleMobileScreenMembers={toggleMobileScreenMembers}
            />

            <div
                className={`${
                    isPrivateChat
                        ? "sm:w-[95svw] md:w-[90svw] lg:w-[800px]"
                        : "md:w-[calc(95svw-250px)] xl:w-[calc(90svw-250px)]"
                } block w-full rounded-t-lg mx-auto sm:rounded-t-xl bg-gray-700 rounded-b-sm overflow-hidden`}
            >
                <div className="header w-full px-[.5em] py-[.5em] lg:py-[.75em] flex items-center h-max bg-gray-600">
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
                {!isPrivateChat && (
                    <div className="p-[.75em] w-full">
                        <div className="flex justify-between items-center pb-1">
                            <h4 className="text-gray-400 text-sm md:text-base sm:font-semibold">
                                HOSTED BY
                            </h4>

                            <div className="inline-flex md:items-center gap-4 text-sm">
                                <span className="text-gray-500 inline-block text-xs sm:text-sm">
                                    <DateFormatter data={room.createdAt} />
                                </span>
                            </div>

                            <div className="inline-block md:hidden">
                                <button
                                    title="Group Participants"
                                    className="text-xs inline-flex items-center gap-2 p-1 rounded-full border px-2 hover:text-blue-400 transition border-blue-400"
                                    onClick={() => {
                                        toggleMobileScreenMembers((p) => !p)
                                    }}
                                >
                                    <span>Members</span>
                                    <span>
                                        <svg
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                        </svg>
                                    </span>
                                </button>
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
                                {/* Sub */}

                                {socket && room.host._id !== user?._id && (
                                    <SubscribeButton
                                        isMember={isMember}
                                        joinChatRoom={joinChatRoom}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="pt-2 pb-0 sm:px-4 px-2 w-full">
                    <ChatVite
                        room={room}
                        isMember={isMember}
                        joinChatRoom={joinChatRoom}
                        roomId={room._id}
                    />
                </div>
            </div>
            {!isPrivateChat && (
                <div className="rounded-lg h-full sm:rounded-xl overflow-hidden min-w-[250px] bg-gray-700 hidden md:block">
                    <Members
                        room={room}
                        socket={socket}
                        setRoom={setRoom}
                        setIsMember={setIsMember}
                    />
                </div>
            )}
        </div>
    )
}
