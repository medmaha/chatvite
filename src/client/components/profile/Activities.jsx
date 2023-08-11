import React, { useEffect, useState } from "react"
import Link from "next/link"

export default function Activities({ activities: data }) {
    const [activities, setActivities] = useState([])

    useEffect(() => {
        setActivities(data)
    }, [data])

    return (
        <div className="hidden md:block flex-1 bg-slate-800 min-w-[250px] px-1 max-w-[450px]">
            <h5 className="font-semibold tracking-wide py-2 px-4 sm:text-center text-lg">
                Recent Activities
            </h5>
            <div className="overflow-hidden overflow-y-auto max-h-[73.5vh] mb-1 p-2">
                {activities.map((activity) => {
                    return (
                        <div
                            key={activity._id}
                            className="block overflow-hidden"
                        >
                            <div className="flex justify-between items-center">
                                <p>{activity.action}</p>
                                <Link
                                    href={`/room/${activity.room.slug}`}
                                    // href={`/feed?q=${activity.topic.slug}&tid=${activity.topic._id}`}
                                    className="text-blue-400 hover:text-blue-500 font-semibold tracking-wide"
                                >
                                    {activity.room.name}
                                </Link>
                            </div>
                            <div className="">
                                <p className="p-2 bg-gray-800 my-2 text-sm rounded-md text-gray-400 truncate">
                                    {activity.message}
                                </p>
                            </div>
                            <span className="divider"></span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
