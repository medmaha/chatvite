import React, { useCallback, useContext, useEffect, useState } from "react"
import MemberCollections from "./MemberCollections"
import axios from "axios"
import { GlobalContext } from "../../../contexts"

export default function Members({ socket, room, setIsMember }) {
    const { user, newAlertEmit } = useContext(GlobalContext)
    const [members, setMembers] = useState(room.members)

    useEffect(() => {
        if (socket) {
            socket.on("add-subscription", (newMember) => {
                setMembers((prev) => {
                    return [
                        ...prev.filter((member) => member._id !== member._id),
                        newMember,
                    ]
                })
            })
            socket.on("del-subscription", (member_id) => {
                setMembers((prev) =>
                    prev.filter((member) => member._id !== member_id),
                )
            })
        }
        return () => {
            socket?.off("member-added", () => {})
            socket?.off("member-removed", () => {})
        }
    }, [socket, members, room])

    // called by the custom subscription event dispatcher
    const updateMemberSubscription = useCallback(
        (type) => {
            switch (type) {
                case "add":
                    setMembers((prev) => {
                        return [
                            ...prev.filter((member) => member._id !== user._id),
                            user,
                        ]
                    })
                    break
                case "remove":
                    setMembers((prev) =>
                        prev.filter((member) => member._id !== user._id),
                    )
                    break
                default:
                    break
            }
        },
        [user],
    )

    useEffect(() => {
        async function getMembers() {
            if (Array.isArray(room?.members)) {
                return setMembers(room.members)
            }
            try {
                const { data } = await axios.get(
                    `/api/room/members?rid=${room._id}`,
                )
                setMembers(data)
            } catch (error) {
                const errorMsg =
                    error?.response?.data?.message || error?.message
                newAlertEmit({
                    invalid: true,
                    text: errorMsg,
                    duration: 5000,
                })
            }
        }
        getMembers()
    }, [room, newAlertEmit])

    useEffect(() => {
        if (user) {
            document.addEventListener("member-subscription", (ev) => {
                const { type } = ev.detail
                updateMemberSubscription(type)
            })

            return () => {
                document.removeEventListener("member-subscription", (ev) => {})
            }
        }
    }, [user, updateMemberSubscription])

    useEffect(() => {
        setIsMember(
            Boolean(members?.find((member) => member._id === user?._id)),
        )
    }, [members, setIsMember, user])

    return (
        <>
            <div className="flex w-full items-center justify-between bg-gray-600 p-[.5em] sm:p-[1em] text-gray-200 font-bold">
                <h1 className="text-[1.125em] tracking-wide">Members</h1>
                <span>{members?.length || ""}</span>
            </div>

            <div className="mt-[.5em] w-full">
                <MemberCollections host={room.host} members={members} />
            </div>
        </>
    )
}
