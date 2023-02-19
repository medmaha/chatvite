import React from "react"

export default function Member({ member, host }) {
    return (
        <div className="mb-4 w-full">
            <div className="flex gap-2">
                <div className="">
                    <button className="user w-[2em] h-[2em] rounded-full bg-gray-800 border-solid border-blue-400 border-[1px]">
                        <span></span>
                    </button>
                </div>
                <div className="flex justify-between w-full">
                    <div className="leading-none">
                        <button className="inline-flex flex-col justify-start text-left">
                            <span className=" py-[1px] leading-none lg:text-lg font-semibold ">
                                {member.name}
                            </span>

                            {host && (
                                <span className="text-blue-400 leading-none font-semibold ">
                                    HOST
                                </span>
                            )}

                            <span className="leading-none text-sm font-semibold text-gray-400">
                                @{member.username}
                            </span>
                        </button>
                    </div>
                    <div className="">
                        <button className="bg-blue-400 font-semibold tracking-wide rounded-lg px-[.25em] py-[.15em]">
                            + follow
                        </button>
                    </div>
                </div>
            </div>
            <div className="pl-[2.5em] flex flex-wrap items-center gap-1 leading-none">
                <p className="leading-none text-sm text-gray-400">
                    10k followers
                </p>
                <p className="leading-none text-sm text-gray-400">|</p>
                <p className="leading-none text-sm text-gray-400">
                    following 2.6k
                </p>
            </div>
        </div>
    )
}
