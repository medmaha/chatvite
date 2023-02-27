import React, { useEffect, useState } from "react"

import Link from "next/link"

export default function TopicAndRooms({ rooms }) {
    const [data, setData] = useState([])

    useEffect(() => {
        setData(rooms)
    }, [rooms])

    return (
        <div className=" flex-1 bg-gray-700 px-1 min-w-[250px] md:min-w-[320px] lg:min-w-[400px] max-w-[500px]">
            <h5 className="font-semibold tracking-wide pb-2 text-center tex-lg">
                Topics & Rooms
            </h5>
            <div className="overflow-y-auto max-h-[75vh] mb-1 p-2">
                {data.map((room, i) => {
                    return (
                        <span key={room._id}>
                            <div className="p-2 bg-gray-600 rounded-sm mb-2">
                                <div className="flex justify-between gap-2">
                                    <Link
                                        href={`/room/${room.slug}`}
                                        className="pb-2 hover:text-blue-400 transition"
                                    >
                                        <p className="font-semibold md:text-lg lg:text-xl tracking-wider">
                                            {room.name}
                                        </p>
                                    </Link>
                                    {/* p.text.gray-300.text-sm.truncate */}
                                    <div className="">
                                        <p className="text-gray-400 text-sm">
                                            14 June
                                        </p>
                                    </div>
                                </div>
                                <span className="divider"></span>
                                <div className="flex justify-between items-center gap-4">
                                    <div className="font-light flex gap-1 text-sm items-center">
                                        <span className="font-bold text-xs">
                                            705
                                        </span>
                                        <span>Chats</span>
                                    </div>
                                    <div className="font-light flex gap-1 text-sm items-center truncate">
                                        <span className="font-bold text-xs">
                                            152
                                        </span>
                                        <span>Members</span>
                                        <span
                                            title="Including You"
                                            className="text-sm text-blue-400 truncate font-semibold text-base"
                                        >
                                            + Me
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </span>
                    )
                })}
            </div>
        </div>
    )
}
