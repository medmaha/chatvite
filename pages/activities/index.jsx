import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import Link from "next/link"
import { getUserAvatarUrl } from "../../src/utils/index"
import DateFormatter from "../../src/client/components/UI/layouts/DateFormatter"
import Pending from "../../src/client/components/UI/Pending"
import axios from "axios"

export default function Index() {
    const router = useRouter()
    return (
        <>
            <div className="flex justify-evenly items-center gap-4 px-2 pb-6 pt-8">
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
                <h2 className="text-2xl font-semibold tracking-wide">
                    Activities In Chatvite
                </h2>
            </div>
            <div className="pb-8 pt-4 mx-auto max-w-[500px]">
                <Activities />
            </div>
        </>
    )
}

function Activities() {
    const [activities, setActivities] = useState(false)

    useEffect(() => {
        fetchActivities()
    }, [])

    function fetchActivities() {
        axios
            .get("/api/activity/list", { credentials: true })
            .then((res) => {
                setActivities(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="sticky top-[0]">
            <div className="bg-gray-700 rounded-md overflow-hidden pb-2">
                <div className="bg-gray-600 p-2 ">
                    <h3 className="text-lg font-semibold tracking-wide">
                        Activities
                    </h3>
                </div>
                <div className="max-h-[calc(100vh-135px)] overflow-hidden overflow-y-auto h-full mt-1">
                    {activities ? (
                        <ActivityCollections activities={activities} />
                    ) : (
                        <Pending h={"400px"} />
                    )}
                </div>
            </div>
        </div>
    )
}

function ActivityCollections({ activities }) {
    return (
        <div>
            {activities.map((activity) => {
                return (
                    <span key={activity._id}>
                        <Activity activity={activity} />
                    </span>
                )
            })}
        </div>
    )
}

function Activity({ activity }) {
    return (
        <div className="border-b-[1px] border-gray-600 p-2">
            <div className="flex gap-2">
                <div className="">
                    <button className="user w-[45px] h-[45px] rounded-full bg-gray-800 border-solid border-blue-400 border-[1px]">
                        <Image
                            src={getUserAvatarUrl(activity.sender.avatar)}
                            alt={activity.sender.username}
                            width={45}
                            height={45}
                            className="rounded-full"
                        />
                    </button>
                </div>
                <div className="flex flex-col w-full mb-1 overflow-hidden">
                    <div className="leading-none">
                        <Link
                            href={`/profile/${activity.sender.username}`}
                            className="text-blue-400 font-semibold text-sm tracking-wide"
                        >
                            @{activity.sender.username}
                        </Link>
                    </div>
                    <div className="pr-1 pb-1">
                        <p className="text-gray-400 text-xs">
                            <DateFormatter data={activity.createdAt} />
                        </p>
                        <div className="flex flex-wrap justify-between gap-1 items-center">
                            <p className="max-w-[15c text-sm">
                                {activity.action}
                            </p>
                            <Link
                                href={`room/${activity.room.slug}`}
                                className="p-1 text-sm bg-gray-800 ml-1 rounded-lg outline outline-[1px] outline-blue-400 text-blue-400 font-semibold tracking-wide truncate"
                            >
                                {activity.room.name}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <p className="p-2 w-max bg-gray-800 my-2 text-sm rounded-md text-gray-400 truncate max-w-[90%]">
                    {activity.message}
                </p>
            </div>
        </div>
    )
}
