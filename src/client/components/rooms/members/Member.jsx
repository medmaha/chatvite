import React from "react"
import Image from "next/image"
import Link from "next/link"

export default function Member({ member, host }) {
    return (
        <div className="mb-4 w-full">
            <div className="flex gap-2 ">
                <div className="w-max">
                    <button className="user w-[37px] h-[37px] rounded-full bg-gray-800 border-solid border-blue-400 border-[1px]">
                        <Image
                            width={35}
                            height={35}
                            alt="member avatar"
                            src={member.avatar}
                            className="rounded-full"
                            style={{ objectFit: "cover", height: "35px" }}
                        />
                    </button>
                </div>
                <div className="inline-flex flex-col justify-between w-full gap-2 flex-1">
                    <div className="flex flex-col ">
                        <Link
                            href={`profile/${member.username}`}
                            className="inline-flex flex-col justify-start text-left gap-1"
                        >
                            <span className="py-[1px] leading-none lg:text-lg font-semibold truncate md:max-w-[15ch] lg:max-w-[20ch]">
                                {member.name}
                            </span>
                        </Link>
                        <Link
                            href={`profile/${member.username}`}
                            className="leading-none text-xs font-semibold text-gray-400 truncate max-w-[18ch]"
                        >
                            @{member.username}
                        </Link>
                        {/* {host && (
                            <span className="text-blue-400 leading-none font-semibold my-1">
                                HOST
                            </span>
                        )} */}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 leading-none">
                        <p className="leading-none text-xs text-gray-400">
                            10k followers
                        </p>
                        <p className="leading-none text-xs text-gray-400">|</p>
                        <p className="leading-none text-xs text-gray-400">
                            following 2.6k
                        </p>
                    </div>
                </div>
                <div className="w-max inline-block self-center">
                    <div className="">
                        <button className="bg-blue-400 font-semibold tracking-wide rounded-lg px-[.25em] py-[.15em]">
                            + follow
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
