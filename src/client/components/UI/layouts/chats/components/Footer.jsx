import React from "react"
import Link from "next/link"

export default function Footer({ room, type }) {
    return (
        <div className="flex justify-between items-center py-2">
            <div className="">
                <button
                    title="Private Room"
                    className="font-semibold p-1 rounded-md text-blue-400 hover:text-blue-500 transition cursor-default"
                >
                    #{type}
                </button>
            </div>
            <div className="">
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
                    className="px-3 py-2 rounded-full  transition-[color,outline] bg-gray-800 text-gray-300 hover:text-blue-400 hover:outline-blue-400 hover:outline-[1px] hover:outline"
                >
                    {room.topic.name}
                </Link>
            </div>
        </div>
    )
}
