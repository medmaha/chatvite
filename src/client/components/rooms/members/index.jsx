import React, { useEffect, useState } from "react"
import MemberCollections from "./MemberCollections"

export default function Members({ socket, room }) {
    const [members, setMembers] = useState(room.members)

    useEffect(() => {
        setMembers(room.members)
    }, [room.members])

    useEffect(() => {
        socket.on("member-add", (member) => {
            setMembers((prev) => {
                return [...prev, member]
            })
        })
        socket.on("member-remove", (user) => {
            const _members = members.filter((member) => member.id !== user.id)
            setMembers(_members)
        })
    }, [])
    return (
        <div className="">
            <div className="flex items-center justify-between bg-gray-600  p-[.5em] text-gray-200 font-bold">
                <h1 className="text-[1.125em] tracking-wide">Members</h1>
                <span>{members.length}</span>
            </div>

            <div className="mt-[.5em]">
                <MemberCollections host={room.host} members={members} />
            </div>
        </div>
    )
}
