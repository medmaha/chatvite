import React from "react"
import Link from "next/link"

export default function Topic({ topic: data, subscribe, user }) {
    const [topic, setTopic] = React.useState(data)

    React.useEffect(() => {
        setTopic(data)
    }, [data])

    function subscribeCallback(joined) {
        if (joined) {
            setTopic((prev) => {
                return { ...prev, followers: [...prev.followers, user] }
            })
        } else {
            setTopic((prev) => {
                const followers = prev.followers.filter(
                    (follower) => follower.id !== user.id,
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
            <div
                onClick={() =>
                    subscribe(topic.id || topic._id, subscribeCallback)
                }
                className="W-max py-2"
            >
                {(() => {
                    const follower = topic.followers.find((follower) => {
                        return follower.id === user?.id
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
