import React, { useContext, useEffect, useLayoutEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { GlobalContext } from "../../../contexts"

export default function Member({ member: data, host }) {
    const [member, setMember] = useState(data)

    const [isFollowing, toggleFollowing] = useState(null)

    const { user, newAlertEmit } = useContext(GlobalContext)

    useLayoutEffect(() => {
        setMember(data)
    }, [data])

    useLayoutEffect(() => {
        toggleFollowing(!!member.followers.find((_id) => _id === user?._id))
    }, [user, data])

    async function follow() {
        if (!user) return

        const _follow = isFollowing
        toggleFollowing(!_follow)
        try {
            // const { data } = await axios.post(
            //     "/api/room/members/follow",
            //     { userId: member._id },
            //     { withCredentials: true },
            // )
            const { data } = await axios.post(
                `/api/profile/follow`,
                { pid: member._id },
                { withCredentials: true },
            )
            setMember((prev) => {
                let _mFn, _mFs
                if (data.isFollowing) {
                    _mFs = [...prev.followers, user._id]
                    _mFn = [...prev.following, user._id]
                } else {
                    _mFs = prev.followers.filter((_id) => _id !== user._id)
                    _mFn = prev.following.filter((_id) => _id !== user._id)
                }
                return {
                    ...prev,
                    followers: _mFs,
                    following: _mFn,
                }
            })
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
                    <div className="flex flex-col  text-sm">
                        {!host ? (
                            <div className="pb-1 flex flex-col gap-[2px]">
                                <Link
                                    href={`profile/${member.username}`}
                                    className="inline-flex flex-col justify-start text-left gap-1 text-gray-300"
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
                            <div className="pb-1 flex flex-col gap-[2px]">
                                <Link
                                    href={`profile/${member.username}`}
                                    className="inline-flex items-start justify-start text-left gap-1 text-gray-300"
                                >
                                    <span className="leading-none font-semibold truncate md:max-w-[15ch] lg:max-w-[20ch]">
                                        <b>HOST</b>
                                    </span>
                                    <span className="pb-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 18 18"
                                            className="fill-blue-400"
                                        >
                                            <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z" />
                                        </svg>
                                    </span>
                                </Link>
                                <Link
                                    href={`profile/${member.username}`}
                                    className="leading-none text-xs font-semibold text-gray-400 truncate max-w-[18ch]"
                                >
                                    {member.name ? (
                                        member.name
                                    ) : (
                                        <>@{member.username}</>
                                    )}
                                </Link>
                            </div>
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
                                        className="text-sm bg-blue-400 hover:bg-blue-500 bg-opacity-80 hover:bg-opacity-100 transition font-semibold tracking-wide rounded-lg px-[.25em] py-[.15em]"
                                    >
                                        + follow
                                    </button>
                                ) : (
                                    <button
                                        onClick={follow}
                                        className="bg-red-400 text-sm hover:bg-red-500 bg-opacity-80 hover:bg-opacity-100 transition font-semibold tracking-wide rounded-lg px-[.25em] py-[.15em]"
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
