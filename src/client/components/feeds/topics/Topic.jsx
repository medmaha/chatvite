import React from "react"

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
        <div className="flex justify-between items-center cursor-pointer min-h-[50px] py-2 my-1 px-1 rounded-md transition hover:bg-gray-700">
            <div className="md:text-lg lg:text-base">
                <button>{topic.name}</button>
            </div>
            <div
                onClick={() =>
                    subscribe(topic.id || topic._id, subscribeCallback)
                }
                className="W-max"
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
