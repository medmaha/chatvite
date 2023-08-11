import React, { useState, useLayoutEffect, useCallback } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import axios from "axios"

import { useSession } from "next-auth/react"
import Pending from "../../src/client/components/UI/Pending"

export default function Index() {
    const router = useRouter()
    return (
        <div className="pb-8 pt-4 mx-auto max-w-[700px]">
            <div className="flex items-center px-2 justify-between pt-4 md:justify-evenly gap-4">
                <button
                    title="Back"
                    onClick={() => router.back()}
                    className="ml-4"
                >
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-blue-400"
                        >
                            <path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z" />
                        </svg>
                    </span>
                </button>
                <div className="text-center">
                    <h3 className="text-gray-300 text-lg font-semibold">
                        Browse Topics
                    </h3>
                    <p className="text-sm text-gray-400 tracking-wide font-semibold">
                        Discover hot trending topics
                    </p>
                </div>
            </div>

            <Topics />
        </div>
    )
}

function Topics() {
    const [topics, setTopics] = useState(null)
    const session = useSession()
    const router = useRouter()

    const fetchTopics = useCallback(() => {
        axios
            .get("api/topic/list")
            .then((res) => setTopics(res.data))
            .catch((err) => {
                console.log(err?.message)
            })
    }, [])

    useLayoutEffect(() => {
        fetchTopics()
        document.addEventListener("room", fetchTopics)
        return () => document.removeEventListener("room", fetchTopics)
    }, [fetchTopics])

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
        <div className="">
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

function TopicCollections({ topics, subscribe, user }) {
    return (
        <div>
            {topics.map((topic) => {
                return (
                    <span key={topic._id}>
                        <Topic
                            topic={topic}
                            subscribe={subscribe}
                            user={user}
                        />
                        <span className="divider"></span>
                    </span>
                )
            })}
        </div>
    )
}

function Topic({ topic: data, user }) {
    const [topic, setTopic] = React.useState(data)
    const router = useRouter()

    React.useEffect(() => {
        setTopic(data)
    }, [data])

    function subscribe() {
        if (!user) return router.push("/auth/login")
        const follower = topic.followers.find((follower) => {
            return follower._id === user?._id
        })
        subscribeCallback(!!follower ? false : true)
        axios
            .post(
                "api/topic/subscribe",
                { id: topic._id },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                },
            )

            .then((res) => {
                const data = res.data
                if (data.joined) {
                    subscribeCallback(true, true)
                } else if (data.joined === false) {
                    subscribeCallback()
                }
            })
            .catch((err) => console.log(err))
    }

    function subscribeCallback(joined, pop) {
        if (joined) {
            setTopic((prev) => {
                if (pop) prev.followers.pop()
                return { ...prev, followers: [...prev.followers, user] }
            })
        } else {
            setTopic((prev) => {
                const followers = prev.followers.filter(
                    (follower) => follower._id !== user._id,
                )
                return { ...prev, followers }
            })
        }
    }

    return (
        <div className="flex justify-between gap-2 items-center cursor-pointer min-h-[50px] my-1 px-1 rounded-md transition hover:bg-gray-700">
            <Link
                href={`/feed?q=${topic.slug}&tid=${topic.id || topic._id}`}
                shallow={true}
                className="text-sm max-w-[25ch] lg:max-w-[22ch] xl:max-w-[30ch] flex-1 py-2 truncate"
            >
                <span title={topic.name}>{topic.name}</span>
            </Link>
            <div onClick={subscribe} className="W-max py-2">
                {(() => {
                    const follower = topic.followers.find((follower) => {
                        return follower._id === user?._id
                    })

                    if (follower)
                        return (
                            <button className="bg-red-400 px-2 py-1 rounded-md hover:bg-red-500 transition">
                                Unfollow
                            </button>
                        )
                    return (
                        <button className="bg-blue-400 px-2 py-1 rounded-md hover:bg-blue-500 transition">
                            Follow
                        </button>
                    )
                })()}
            </div>
        </div>
    )
}
