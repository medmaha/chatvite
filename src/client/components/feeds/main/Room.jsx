import { useRouter } from "next/router"
import React, { useContext, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { GlobalContext } from "../../../contexts"
import axios from "axios"
import { getUserAvatarUrl } from "../../../../utils"
import DateFormatter from "../../UI/layouts/DateFormatter"

export default function Room({ room: data, interactions = true }) {
    const router = useRouter()
    const [room, setRoom] = React.useState(data)

    const { user } = useContext(GlobalContext)

    function navigateToRoom() {
        router.push(`/room/${room.slug}`)
    }

    function joinRoom() {
        if (!user) {
            router.push("/auth/login")
            return
        }
        setRoom({ ...room, members: [user, ...room.members] })
        axios
            .post(
                "/api/room/join",
                { id: room._id, room: true },
                { withCredentials: true },
            )
            .then((res) => {
                setRoom(res.data.room)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="bg-gray-700 p-3 rounded-md mb-2 min-w-[180px] sm:min-w-[250px]">
            <div className="headers flex justify-between items-center">
                <Link
                    href={"/profile/" + room.host.username}
                    className="flex gap-2 items-center"
                    id=""
                >
                    <span className="inline-block w-[45px] h-[45px] rounded-full bg-gray-800 border-solid border-blue-400 border-[1px]">
                        <Image
                            src={getUserAvatarUrl(room.host.avatar)}
                            alt="room host"
                            width={45}
                            height={45}
                            className="rounded-full"
                        />
                    </span>
                    <span className="text-blue-400 font-semibold text-sm tracking-wide">
                        @{room.host.username}
                    </span>
                </Link>
                <div className="inline text-sm text-gray-500">
                    <DateFormatter data={room.createdAt} />
                </div>
            </div>
            <div className="h-max">
                <Link
                    className="px-1 cursor-pointer hover:text-blue-400 transition-[color] h-max py-2 mb-1 inline-block"
                    href={`/room/${room.slug}`}
                    // onClick={navigateToRoom}
                >
                    <span className="text-xl font-semibold tracking-wide inline-block">
                        {room.name}
                    </span>
                    <p className=" text-gray-300 text-sm opacity-70 font-semibold tracking-wide line-clamp-3">
                        {room.description}
                    </p>
                </Link>
            </div>
            <div className="mb-3">
                <span className="divider"></span>
            </div>
            <div className="flex justify-between gap-4 items-center">
                <div className="">
                    <button className="inline-flex w-max items-center gap-2 font-light cursor-default">
                        {(() => {
                            if (room.isPrivate) {
                                return (
                                    <span
                                        title="This chatroom is private to you"
                                        className="font-semibold text-sky-400"
                                    >
                                        #Private
                                    </span>
                                )
                            }
                            if (user?._id === room.host._id)
                                return (
                                    <span className="font-semibold text-gray-400">
                                        Hosted by you
                                    </span>
                                )
                            if (!interactions)
                                return (
                                    <span className="font-semibold text-gray-400">
                                        Hosted by {room.host.username}
                                    </span>
                                )

                            const isMember = room.members.find(
                                (member) =>
                                    member._id === (user?.id || user?._id),
                            )
                            if (isMember)
                                return (
                                    <>
                                        <span className="text-blue-400 cursor-default">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 32 32"
                                                fill="currentColor"
                                            >
                                                <title>People</title>
                                                <path d="M30.539 20.766c-2.69-1.547-5.75-2.427-8.92-2.662 0.649 0.291 1.303 0.575 1.918 0.928 0.715 0.412 1.288 1.005 1.71 1.694 1.507 0.419 2.956 1.003 4.298 1.774 0.281 0.162 0.456 0.487 0.456 0.85v4.65h-4v2h5c0.553 0 1-0.447 1-1v-5.65c0-1.077-0.56-2.067-1.461-2.584z"></path>
                                                <path d="M22.539 20.766c-6.295-3.619-14.783-3.619-21.078 0-0.901 0.519-1.461 1.508-1.461 2.584v5.65c0 0.553 0.447 1 1 1h22c0.553 0 1-0.447 1-1v-5.651c0-1.075-0.56-2.064-1.461-2.583zM22 28h-20v-4.65c0-0.362 0.175-0.688 0.457-0.85 5.691-3.271 13.394-3.271 19.086 0 0.282 0.162 0.457 0.487 0.457 0.849v4.651z"></path>
                                                <path d="M19.502 4.047c0.166-0.017 0.33-0.047 0.498-0.047 2.757 0 5 2.243 5 5s-2.243 5-5 5c-0.168 0-0.332-0.030-0.498-0.047-0.424 0.641-0.944 1.204-1.513 1.716 0.651 0.201 1.323 0.331 2.011 0.331 3.859 0 7-3.141 7-7s-3.141-7-7-7c-0.688 0-1.36 0.131-2.011 0.331 0.57 0.512 1.089 1.075 1.513 1.716z"></path>
                                                <path d="M12 16c3.859 0 7-3.141 7-7s-3.141-7-7-7c-3.859 0-7 3.141-7 7s3.141 7 7 7zM12 4c2.757 0 5 2.243 5 5s-2.243 5-5 5-5-2.243-5-5c0-2.757 2.243-5 5-5z"></path>
                                            </svg>
                                        </span>
                                        <span>Joined</span>
                                    </>
                                )
                            return (
                                <span
                                    onClick={joinRoom}
                                    className="px-4 font-semibold py-1 rounded-md bg-blue-400 hover:bg-blue-500 transition cursor-pointer"
                                >
                                    Join
                                </span>
                            )
                        })()}
                    </button>
                </div>
                <Link
                    href={`/feed?q=${room.topic.slug}&tid=${room.topic._id}`}
                    onClick={(ev) => {
                        const url = `/feed?q=${room.topic.slug}&tid=${room.topic._id}`

                        if (
                            window.location.href.split(
                                window.location.host,
                            )[1] === url
                        )
                            ev.preventDefault()
                    }}
                    shallow={true}
                    className="px-3 py-2 rounded-full truncate transition-[color,outline] bg-gray-800 text-gray-300 hover:text-blue-400 hover:outline-blue-400 hover:outline-[1px] hover:outline"
                >
                    {room.topic.name}
                </Link>
            </div>
        </div>
    )
}
