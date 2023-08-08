import Image from "next/image"
import Link from "next/link"
import React from "react"
import { getUserAvatarUrl } from "../../../../utils"
import DateFormatter from "../../UI/layouts/DateFormatter"

export default function Activity({ activity }) {
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
            <div className="mx-auto">
                <p className="p-2 w-max bg-gray-800 my-2 text-sm rounded-md text-gray-400 truncate max-w-[32ch] mx-auto">
                    {activity.message}
                </p>
            </div>
        </div>
    )
}
