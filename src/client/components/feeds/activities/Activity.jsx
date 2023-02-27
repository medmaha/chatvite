import React from "react"

export default function Activity({ activity }) {
    return (
        <div className="border-[1px] border-gray-600 p-2 mb-2">
            <div className="flex gap-2 w-full">
                <div className="">
                    <button className="user w-[45px] h-[45px] rounded-full bg-gray-800 border-solid border-blue-400 border-[1px]">
                        <span></span>
                    </button>
                </div>
                <div className="flex flex-col gap-1 w-full mb-1 overflow-hidden">
                    <div className="">
                        <button className="text-blue-400 font-semibold text-sm tracking-wide">
                            @{activity.sender.username}
                        </button>
                    </div>
                    <div className="">
                        <p className="text-gray-400 text-sm">2hrs ago</p>
                        <div className="flex justify-between items-center">
                            <p>{activity.action}</p>
                            <button className="text-blue-400 font-semibold tracking-wide truncate">
                                {activity.room.name}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ml-[50px]">
                <p className="p-2 bg-gray-800 my-2 text-sm rounded-md text-gray-400 truncate max-w-[20ch] lg:max-w-[32ch]">
                    {activity.message}
                </p>
            </div>
        </div>
    )
}
