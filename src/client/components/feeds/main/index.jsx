import React, { useContext, useEffect, useState } from "react"
import RoomCollections from "./RoomCollections"
import { GlobalContext } from "../../../contexts"

export default function Main({ feeds: data }) {
    const { setCreateRoom } = useContext(GlobalContext)

    const [feeds, setFeeds] = useState(data)

    function updateFeed(ev) {
        const data = ev.detail?.data

        setFeeds((prev) => {
            return [data, ...prev]
        })
    }

    useEffect(() => {
        document.addEventListener("room", updateFeed)

        return () => document.removeEventListener("room", updateFeed)
    }, [])

    function createRoom() {
        setCreateRoom(true)
    }
    return (
        <div>
            <div className="flex justify-around mt-1">
                <div className="lg:order-first order-last">
                    <h4>Chat Rooms</h4>
                    <p className="text-gray-400">85 rooms available</p>
                </div>
                <div className="">
                    <button
                        className="btn bg-blue-400 px-3 py-2 rounded-md text-lg "
                        onClick={createRoom}
                    >
                        <b className="text-2xl leading-none">+</b>{" "}
                        <span className="font-semibold">FuseChat</span>
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <RoomCollections feeds={feeds} />
            </div>
        </div>
    )
}
