import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../contexts"
import axios from "axios"

export default function Stats({ stats, profileId }) {
    const [statistics, setStatistics] = useState(stats || [])
    const [isFollowing, setIsFollowing] = useState(false)

    const { user } = useContext(GlobalContext)

    useEffect(() => {
        if (user && profileId !== user._id) {
            // loops through the followings object from stats list
            const isMember = statistics[0]?.data.find((_follower) => {
                return _follower._id === user._id
            })
            setIsFollowing(Boolean(isMember))
        }
    }, [statistics, user])

    async function followProfile() {
        if (!user) {
            alert("Login first")
            return
        }

        setIsFollowing((prev) => !prev)

        try {
            const { data } = await axios.post(
                `/api/profile/follow`,
                { pid: profileId },
                {
                    withCredentials: true,
                },
            )
            const __stats = [...statistics]
            let followers = __stats[0].data

            if (data.joined) {
                followers.push(user)
            } else {
                followers = followers.filter((_user) => _user._id !== user._id)
            }
            __stats[0].data = followers
            setIsFollowing(data.joined)
            setStatistics(() => [...__stats])
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <>
            <div className="mt-4">
                <div className="flex justify-center flex-wrap items-center gap-2">
                    {statistics.map((phase, idx) => {
                        return (
                            <span key={idx} className=" bg-gray-700 rounded-md">
                                <button
                                    onClick={() => {
                                        if (phase.name === "Follow") {
                                            followProfile()
                                        }
                                    }}
                                    className={`rounded-md overflow-hidden bg-blue-500 inline-flex gap-2 items-center ${
                                        phase.name === "Follow"
                                            ? "bg-opacity-20 hover:bg-opacity-100 transition"
                                            : "cursor-default bg-opacity-[0.1%]"
                                    }`}
                                >
                                    <span
                                        className={`bg-block w-full h-full  py-1 px-2 ${
                                            isFollowing &&
                                            phase.name === "Follow"
                                                ? " bg-red-500"
                                                : ""
                                        } ${
                                            phase.name === "Follow"
                                                ? " px-4 font-semibold"
                                                : ""
                                        }`}
                                    >
                                        <span className="text-gray-300 pr-1 text-base">
                                            {isFollowing &&
                                            phase.name === "Follow"
                                                ? "Unfollow"
                                                : phase.name}
                                        </span>
                                        {phase.name !== "Follow" && (
                                            <span className="text-gray-300 pl-1 font-bold text-sm">
                                                {phase.stats}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            </span>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
