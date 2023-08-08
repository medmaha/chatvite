import React, { useEffect, useLayoutEffect, useState } from "react"
import styles from "./styles.module.css"

import Topics from "./topics"
import Activities from "./activities"
import Main from "./main"

import io from "socket.io-client"
import Paginator from "../UI/Paginator"
import axios from "axios"

export default function Feed({ feeds, roomsCount }) {
    const [_feeds, setFeeds] = useState(feeds)
    useLayoutEffect(() => {
        setFeeds(feeds)
    }, [feeds])
    useEffect(() => {
        console.log(feeds)
    }, [_feeds])

    async function fetchFeeds(data = {}, callback) {
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
            setFeeds(data)
            return Promise.resolve()
        } catch (error) {
            console.log(error.message)
            return Promise.reject(error)
        }
    }

    return (
        <div className="grid md:grid-cols-[auto,1fr,auto] gap-2">
            <div className="hidden md:block">
                <Topics />
            </div>
            <div className="block md:min-w-[450px] mx-auto w-full max-w-[600px]">
                <Paginator
                    Component={Main}
                    componentProp="feeds"
                    data={_feeds}
                    fetchFeeds={fetchFeeds}
                    targetSelector="[data-rooms-collections] [data-room]"
                    roomsCount={roomsCount}
                ></Paginator>
                {/* <Main feeds={feeds.data} fetchFeeds={fetchFeeds} /> */}
            </div>
            <div className="hidden lg:block">
                <Activities />
            </div>
        </div>
    )
}
