import React, { useEffect, useState } from "react"
import axios from "axios"

import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { getUserAvatarUrl } from "../../src/utils"

import DateFormatter from "../../src/client/components/UI/layouts/DateFormatter"
import { useRouter } from "next/router"

export default function Index({ data, _data }) {
    const session = useSession()
    const router = useRouter()
    const [loaded, toggleLoaded] = useState(false)

    useEffect(() => {
        if (session.status !== "loading") {
            console.log(session.data)
            toggleLoaded(true)
        }
    }, [session])

    return (
        <>
            {loaded && session.data && (
                <>
                    <div className="flex items-center px-2 justify-between pt-4 md:justify-evenly gap-4">
                        <button
                            title="Back"
                            onClick={() => router.back()}
                            className="ml-4"
                        >
                            <span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    className="fill-blue-400"
                                >
                                    <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z" />
                                </svg>
                            </span>
                        </button>
                        <div className="text-center">
                            <h2 className="text-gray-300 text-lg font-semibold">
                                Your Chat rooms
                            </h2>
                            <p className="text-sm text-gray-400 tracking-wide font-semibold">
                                View rooms you&apos;ve participated
                            </p>
                        </div>
                    </div>
                    <div className="sm:flex flex-wrap gap-1 pt-4 pb-8 px-1 w-full">
                        <div className="p-2 flex-1 max-w-[450px] w-full mx-auto">
                            <h2 className="text-lg font-semibold text-center bg-gray-600 py-1 rounded-md">
                                My Public Rooms
                            </h2>
                            <div className="py-2">
                                <RoomCollections
                                    user={session.data.user}
                                    feeds={data.public.map((room) => ({
                                        ...room,
                                        host: session.data.user,
                                    }))}
                                />
                            </div>
                        </div>
                        <div className="p-2 flex-1 max-w-[450px] w-full mx-auto">
                            <h2 className="text-lg font-semibold text-center bg-gray-600 py-1 rounded-md">
                                My Private Rooms
                            </h2>
                            <div className="py-2">
                                <RoomCollections
                                    user={session.data.user}
                                    feeds={data.private.map((room) => ({
                                        ...room,
                                        host: session.data.user,
                                    }))}
                                />
                            </div>
                        </div>
                        <div className="p-2 flex-1 max-w-[450px] w-full mx-auto">
                            <h2 className="text-lg font-semibold text-center bg-gray-600 py-1 rounded-md">
                                Joined Rooms
                            </h2>
                            <div className="py-2">
                                <RoomCollections
                                    user={session.data.user}
                                    feeds={data.joined}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

function RoomCollections({ feeds, user }) {
    return (
        <div
            data-rooms-collections
            className="max-h-[600px] overflow-hidden overflow-y-auto"
        >
            {feeds.map((room) => {
                return (
                    <span data-room key={room._id || room.slug}>
                        <Room user={user} room={room} />
                    </span>
                )
            })}
        </div>
    )
}

function Room({ user, room, isMember }) {
    return (
        <div className="bg-gray-700 p-3 rounded-md mb-2 min-w-[180px] sm:min-w-[250px]">
            <div className="headers flex justify-between items-center">
                <Link
                    href={"/profile/" + (room.host || user).username}
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
                    <div className="text-blue-400 font-semibold text-sm tracking-wide inline-flex flex-col">
                        <span>
                            {!!(room.host.username === user.username) ? (
                                <b>Me</b>
                            ) : (
                                room.host.name
                            )}
                        </span>
                        <span>@{room.host.username}</span>
                    </div>
                </Link>
                <div className="inline text-sm text-gray-500">
                    <DateFormatter data={room.createdAt} />
                </div>
            </div>
            <div className="h-max overflow-hidden w-full">
                <Link
                    className="px-1 cursor-pointer hover:text-blue-400 transition-[color] h-max py-2 mb-1 inline-block"
                    href={`/room/${room.slug}`}
                    // onClick={navigateToRoom}
                >
                    <p className="text-xl font-semibold tracking-wide inline-block w-full break-words truncate_ max-w-[20ch] mobile:max-w-[40ch]">
                        {room.name}
                    </p>
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
                                        #Private to You
                                    </span>
                                )
                            }
                            if (user?._id === room.host._id)
                                return (
                                    <span className="font-semibold text-gray-400">
                                        Hosted by You
                                    </span>
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
                                <span className="font-semibold text-gray-400">
                                    Hosted by {room.host.username}
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

export async function getServerSideProps(context) {
    try {
        const res = await axios.get(`${process.env.BASE_URL}/api/rooms`, {
            withCredentials: true,
            headers: { cookie: context.req.headers.cookie },
        })

        return {
            props: { data: res.data },
        }
    } catch (error) {
        console.log(error.message)
        return {
            redirect: {
                destination: "/feed",
                permanent: false,
                replace: true,
            },
        }
    }
}
