import React, { useEffect, useState } from "react"

import Link from "next/link"
import Room from "../feeds/main/Room"

export default function TopicAndRooms({ rooms, authUser }) {
    const [data, setData] = useState([])

    useEffect(() => {
        setData(rooms)
    }, [rooms])

    return (
        <div className=" flex-1 px-1 min-w-[250px] md:min-w-[320px] lg:min-w-[400px] max-w-[500px]">
            <h3 className="font-semibold tracking-wide pb-2 text-center text-xl">
                Chatrooms
            </h3>
            <div className="overflow-y-auto max-h-[73.5vh] mb-1 p-2">
                {data.map((room, i) => {
                    return (
                        <span key={room._id}>
                            <Room room={room} interactions={false} />

                            {i !== data.length - 1 && (
                                <span className="divider"></span>
                            )}
                        </span>
                    )
                })}
            </div>
        </div>
    )
}
