import React, { useEffect, useState } from "react"
import MemberCollections from "./MemberCollections"

export default function Members({ socket, room }) {
    const [members, setMembers] = useState(room.members)

    useEffect(() => {
        setMembers(room.members)
    }, [room.members])

    useEffect(() => {
        if (socket) {
            socket.on("member-added", (member) => {
                setMembers((prev) => {
                    return [...prev, member]
                })
            })
            socket.on("member-removed", (user_id) => {
                const _members = members.filter((member) => {
                    return member._id !== user_id
                })
                setMembers(_members)
            })
        }
        return () => {
            socket?.off("member-added", () => {})
            socket?.off("member-removed", () => {})
        }
    }, [socket])

    return (
        <div className="flex-1 rounded-lg sm:rounded-xl overflow-hidden max-w-[280px] lg:max-w-[350px] bg-gray-700 hidden md:block">
            <div className="flex items-center justify-between bg-gray-600 p-[.5em] sm:p-[1em] text-gray-200 font-bold">
                <h1 className="text-[1.125em] tracking-wide">Members</h1>
                <span>{members.length}</span>
            </div>

            <div className="mt-[.5em]">
                <MemberCollections host={room.host} members={members} />
            </div>
        </div>
    )
}
