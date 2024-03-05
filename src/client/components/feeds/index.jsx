import { Suspense, useCallback, useState } from "react"
import styles from "./styles.module.css"

import Topics from "./topics"
import Activities from "./activities"
import Main from "./main"

import io from "socket.io-client"
import Paginator from "../UI/Paginator"
import axios from "axios"

export default function Feed({ feeds, roomsCount }) {
    const [data, setData] = useState(feeds)

    const fetchFeeds = useCallback(async (data = {}) => {
        const option = {
            url: "/api/feed",
            q: "",
            tid: "",
            ...data,
        }
        try {
            const { data } = await axios.get(option.url + option.q, {
                withCredentials: true,
            })
            setData(data)
            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    }, [])

    return (
        <div className="grid container mx-auto md:grid-cols-[auto,1fr,auto] gap-2">
            <div className="hidden md:block">
                <Topics />
            </div>
            <div className="block md:min-w-[450px] mx-auto w-full max-w-[600px]">
                <Suspense fallback={<ChatCard />}>
                    <Paginator
                        Component={Main}
                        componentProp="feeds"
                        data={data}
                        fetchFeeds={fetchFeeds}
                        targetSelector="[data-rooms-collections] [data-room]"
                        roomsCount={roomsCount}
                    ></Paginator>
                </Suspense>
                {/* <Main feeds={feeds.data} fetchFeeds={fetchFeeds} /> */}
            </div>
            <div className="hidden lg:block max-w-[280px]">
                <Activities />
            </div>
        </div>
    )
}

function ChatCard() {
    return (
        <>
            {new Array(7).fill(0).map((_, index) => {
                return (
                    <div
                        key={index}
                        className="min-h-[60px] w-full block bg-slate-700 animate-pulse"
                    ></div>
                )
            })}
        </>
    )
}
