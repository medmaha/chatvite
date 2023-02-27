import React from "react"
import Room from "./Room"

export default function RoomCollections({ feeds }) {
    return (
        <div>
            {feeds.map((room) => {
                return (
                    <span key={room._id}>
                        <Room room={room} />
                    </span>
                )
            })}
        </div>
    )
}
