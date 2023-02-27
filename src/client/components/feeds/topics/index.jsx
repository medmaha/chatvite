import React, { useState, useLayoutEffect } from "react"

import TopicCollections from "./TopicCollections"

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import axios from "axios"
import Pending from "../../UI/Pending"

export default function Topics() {
    const [topics, setTopics] = useState(null)
    const session = useSession()
    const router = useRouter()

    useLayoutEffect(() => {
        fetchTopics()

        document.addEventListener("room", updateFeedFromCreate)
        return () => document.removeEventListener("room", updateFeedFromCreate)
    }, [])

    function updateFeedFromCreate() {
        fetchTopics()
    }

    function fetchTopics() {
        axios
            .get("api/topic/list")
            .then((res) => setTopics(res.data))
            .catch((err) => {
                console.log(err?.message)
            })
    }

    function subscribe(topic_id, cb) {
        if (!session?.data?.user) {
            router.push("/auth/login")
            return
        }
        axios
            .post(
                "api/topic/subscribe",
                { id: topic_id },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                },
            )

            .then((res) => {
                const data = res.data
                if (data.joined) {
                    cb(true)
                } else if (data.joined === false) {
                    cb()
                }
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="sticky top-[75px]">
            <div className="text-center">
                <h3 className="text-gray-300 text-lg font-semibold">
                    Browse Topics
                </h3>
                <p className="text-sm text-gray-400 tracking-wide font-semibold">
                    Discover hot trending topics
                </p>
            </div>

            <span className="divider mt-2"></span>
            {!topics ? (
                <Pending h={"400px"} />
            ) : (
                <>
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
                </>
            )}
        </div>
    )
}
