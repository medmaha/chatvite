import React, { useEffect } from "react"
import Room from "./Room"

export default function RoomCollections({ feeds, onInit, isMember }) {
    React.useEffect(() => {
        if (onInit) onInit()
    }, [])

    return (
        <div data-rooms-collections>
            {feeds.map((room) => {
                return (
                    <span data-room key={room._id || room.slug}>
                        <Room room={room} isMember={isMember} />
                    </span>
                )
            })}
        </div>
    )
}
