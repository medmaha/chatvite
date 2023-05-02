import React, { useEffect, useLayoutEffect, useState } from "react"
import styles from "./styles.module.css"

import Topics from "./topics"
import Activities from "./activities"
import Main from "./main"

import io from "socket.io-client"
import Paginator from "../UI/Paginator"
import axios from "axios"

export default function Feed({ feeds }) {
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
        <div className="flex justify-center gap-3">
            <div className="flex-1 hidden md:block min-w-[270px] lg:min-w-[250px] max-w-[320px]  basis-[100px]">
                <Topics />
            </div>
            <div className=" flex-1 min-w-[350px] lg:min-w-[400px] max-w-[500px]">
                <Paginator
                    Component={Main}
                    componentProp="feeds"
                    data={_feeds}
                    fetchFeeds={fetchFeeds}
                    targetSelector="[data-rooms-collections] [data-room]"
                ></Paginator>
                {/* <Main feeds={feeds.data} fetchFeeds={fetchFeeds} /> */}
            </div>
            <div className="flex-1 hidden lg:block lg:max-w-[300px] xl:max-w-[330px]">
                <Activities />
            </div>
        </div>
    )
}
