import React, { useContext, useEffect, useLayoutEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { GlobalContext } from "../../../contexts"

export default function Member({ member, host }) {
    const [isFollowing, toggleFollowing] = useState(null)

    const { user, newAlertEmit } = useContext(GlobalContext)

    useLayoutEffect(() => {
        toggleFollowing(!!member.followers.find((_id) => _id === user?._id))
    }, [user])

    async function follow() {
        if (!user) return

        const _follow = isFollowing
        toggleFollowing(!_follow)
        try {
            const { data } = await axios.post(
                "/api/room/members/follow",
                { userId: member._id },
                { withCredentials: true },
            )
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error?.message ||
                "An error occurred"
            newAlertEmit({
                text: errMsg,
                invalid: true,
            })
            toggleFollowing(_follow)
        }
    }

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
                <div className="inline-flex flex-col justify-between w-full flex-1">
                    <div className="flex flex-col ">
                        {!host ? (
                            <div className="pb-1 flex flex-col gap-[2px]">
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
                                    <>@{member.username}</>
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href={`profile/${member.username}`}
                                className="inline-flex pb-1 flex-col justify-start text-left gap-1"
                            >
                                <span className="py-[1px] leading-none lg:text-lg font-semibold truncate md:max-w-[15ch] lg:max-w-[20ch]">
                                    <b>HOST</b>
                                </span>
                            </Link>
                        )}
                        <div className="flex flex-wrap items-center gap-1 leading-none">
                            <p className="leading-none text-xs text-gray-400 items-center">
                                <b>
                                    {member.followers.length +
                                        member.following.length}
                                </b>{" "}
                                connections
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-max inline-block self-center">
                    <div className="">
                        {isFollowing !== null && (
                            <>
                                {!isFollowing ? (
                                    <button
                                        onClick={follow}
                                        className="bg-blue-400 hover:bg-blue-500 bg-opacity-80 hover:bg-opacity-100 transition font-semibold tracking-wide rounded-lg px-[.25em] py-[.15em]"
                                    >
                                        + follow
                                    </button>
                                ) : (
                                    <button
                                        onClick={follow}
                                        className="bg-red-400 hover:bg-red-500 bg-opacity-80 hover:bg-opacity-100 transition font-semibold tracking-wide rounded-lg px-[.25em] py-[.15em]"
                                    >
                                        Unfollow
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
