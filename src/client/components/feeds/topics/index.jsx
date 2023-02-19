import React, { useState, useLayoutEffect } from "react"

import TopicCollections from "./TopicCollections"

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function Topics() {
    const [topics, setTopics] = useState([])
    const session = useSession()
    const router = useRouter()

    useLayoutEffect(() => {
        fetchTopics()
    }, [])

    function fetchTopics() {
        fetch("api/topic/list")
            .then((res) => res.json())
            .then((data) => setTopics(data))
            .catch((err) => {
                console.log(err?.message)
            })
    }

    function subscribe(topic_id, cb) {
        if (!session?.data?.user) {
            router.push("/auth/login")
            return
        }
        fetch("api/topic/subscribe", {
            credentials: "include",
            body: JSON.stringify({ id: topic_id }),
            method: "post",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.joined) {
                    cb(true)
                } else if (data.joined === false) {
                    cb()
                }
                console.log(data)
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="sticky top-[75px]">
            <div className="text-center">
                <h3 className="text-gray-400 text-lg font-semibold">
                    Browser Topics
                </h3>
                <p className="text-sm text-gray-300 tracking-wide font-semibold">
                    Lorem ipsum dolor sit amet.
                </p>
            </div>

            <div
                data-topic-wrapper
                className="mt-2 px-1 overflow-hidden overflow-y-auto max-h-[calc(100vh-190px)]"
            >
                <TopicCollections
                    topics={topics}
                    subscribe={subscribe}
                    user={session?.data?.user}
                />
            </div>
            <div className="flex justify-between gap-4 mt-1 text-blue-400">
                <div className="font-semibold text-lg">
                    <button>Total</button>
                </div>
                <div className="mr-4 font-semibold text-lg">
                    <button>{topics.length}</button>
                </div>
            </div>
        </div>
    )
}
