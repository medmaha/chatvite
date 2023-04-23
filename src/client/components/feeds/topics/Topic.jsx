import React from "react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/router"

export default function Topic({ topic: data, user }) {
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
        <div className="flex justify-between gap-1 items-center cursor-pointer min-h-[50px] my-1 px-1 rounded-md transition hover:bg-gray-700">
            <Link
                href={`?q=${topic.slug}&tid=${topic.id || topic._id}`}
                shallow={true}
                className="md:text-lg lg:text-base flex-1 py-2 truncate"
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
