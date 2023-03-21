import Image from "next/image"
import Link from "next/link"
import React from "react"
import { getUserAvatarUrl } from "../../../../utils"

export default function Activity({ activity }) {
    return (
        <div className="border-[1px] border-gray-600 p-2 mb-2">
            <div className="flex gap-2 w-full">
                <div className="">
                    <button className="user w-[45px] h-[45px] rounded-full bg-gray-800 border-solid border-blue-400 border-[1px]">
                        <Image
                            src={getUserAvatarUrl(activity.sender.avatar)}
                            width={45}
                            height={45}
                            className="rounded-full"
                        />
                    </button>
                </div>
                <div className="flex flex-col gap-1 w-full mb-1 overflow-hidden">
                    <div className="">
                        <Link
                            href={`/profile/${activity.sender.username}`}
                            className="text-blue-400 font-semibold text-sm tracking-wide"
                        >
                            @{activity.sender.username}
                        </Link>
                    </div>
                    <div className="pr-1 pb-1">
                        <p className="text-gray-400 text-sm">2hrs ago</p>
                        <div className="flex justify-between items-center">
                            <p>{activity.action}</p>
                            <Link
                                href={`room/${activity.room.slug}`}
                                className="p-1 bg-gray-800 rounded-lg outline outline-[1px] outline-blue-400 text-blue-400 font-semibold tracking-wide truncate"
                            >
                                {activity.room.name}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ml-[50px]">
                <p className="p-2  bg-gray-800 my-2 text-sm rounded-md text-gray-400 truncate max-w-[20ch] lg:max-w-[32ch]">
                    {activity.message}
                </p>
            </div>
        </div>
    )
}
