import React, { useCallback, useContext, useEffect, useState } from "react"
import MemberCollections from "./MemberCollections"
import axios from "axios"
import { GlobalContext } from "../../../contexts"

export default function Members({ socket, room, setIsMember, setRoom }) {
    const { user, newAlertEmit } = useContext(GlobalContext)
    const [members, setMembers] = useState(null)

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
    }, [socket, members])

    const updateMemberSubscription = useCallback(
        (type) => {
            switch (type) {
                case "add":
                    setMembers((prev) => {
                        const _members = prev || []
                        return [..._members, user]
                    })
                    break
                case "remove":
                    setMembers((prev) => {
                        const _members = prev || []
                        return _members?.filter(
                            (member) => member._id !== user._id,
                        )
                    })
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
                setRoom((prev) => ({ ...prev, members: data }))
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
    }, [room, newAlertEmit, setRoom])

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

    return (
        <>
            <div className="flex w-full items-center justify-between bg-gray-600 p-[.5em] sm:p-[1em] text-gray-200 font-bold">
                <h1 className="text-[1.125em] tracking-wide">Members</h1>
                <span>{members?.length || ""}</span>
            </div>

            <div className="mt-[.5em] w-full">
                <MemberCollections members={members} hostId={room.host.id} />
            </div>
        </>
    )
}
