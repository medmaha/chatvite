import React, { useContext, useEffect, useState } from "react"
import MemberCollections from "./MemberCollections"
import axios from "axios"
import { GlobalContext } from "../../../contexts"

export default function Members({ socket, roomId, hostId, setIsMember }) {
    const [members, setMembers] = useState()
    const { user, newAlertEmit } = useContext(GlobalContext)

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
    }, [user])

    useEffect(() => {
        setIsMember(isMember())
    }, [members])

    useEffect(() => {
        getMembers()
    }, [])

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

    function isMember() {
        return !!members?.find((_user) => {
            return _user._id === user?._id
        })
    }

    async function updateMemberSubscription(type) {
        console.log(type, user)
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
                    return _members?.filter((member) => member._id !== user._id)
                })
                break
            default:
                break
        }
    }

    async function getMembers() {
        try {
            const { data } = await axios.get(`/api/room/members?rid=${roomId}`)
            updateMembers(data)
        } catch (error) {
            const errorMsg = error?.response?.data?.message || error?.message
            console.error(errorMsg)
            newAlertEmit({
                invalid: true,
                text: errorMsg,
                duration: 5000,
            })
        }
    }

    async function updateMembers(data) {
        setMembers((prev) => data)
    }

    return (
        <div className="flex-1 rounded-lg sm:rounded-xl overflow-hidden max-w-[280px] lg:max-w-[350px] bg-gray-700 hidden md:block">
            <div className="flex items-center justify-between bg-gray-600 p-[.5em] sm:p-[1em] text-gray-200 font-bold">
                <h1 className="text-[1.125em] tracking-wide">Members</h1>
                <span>{members?.length || ""}</span>
            </div>

            <div className="mt-[.5em]">
                <MemberCollections members={members} hostId={hostId} />
            </div>
        </div>
    )
}
