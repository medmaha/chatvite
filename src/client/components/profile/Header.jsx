import { useContext, useEffect, useLayoutEffect, useState } from "react"
import Image from "next/image"
import { GlobalContext } from "./../../contexts"
import { getUserAvatarUrl } from "../../../utils"
import axios from "axios"

export default function Header({
    account,
    toggleEdit,
    followers,
    updateProfileStateData,
}) {
    const [myAccount, setMyAccount] = useState(null)
    const [isFollowing, setIsFollowing] = useState(false)
    const [followersList, setFollowersList] = useState(followers.data || [])

    const { user } = useContext(GlobalContext)

    useEffect(() => {
        if (user && account._id !== user._id) {
            // loops through the followings object from stats list
            const isMember = followersList.find((_follower) => {
                return _follower._id === user._id
            })
            setIsFollowing(Boolean(isMember))
            setMyAccount(account._id === user._id)
        } else if (user) {
            setMyAccount(account._id === user._id)
        }
    }, [account, followersList, user])

    async function followProfile() {
        if (!user) {
            alert("You must login first")
            return
        }

        const incFollowers = !isFollowing
        updateFollowingStatus(incFollowers)
        setIsFollowing((prev) => !prev)

        if (incFollowers) setFollowersList(() => [user, ...followersList])
        else {
            setFollowersList(() =>
                followersList.filter((_user) => _user._id !== user._id),
            )
        }

        try {
            const { data } = await axios.post(
                `/api/profile/follow`,
                { pid: account._id },
                {
                    withCredentials: true,
                },
            )
            setIsFollowing(Boolean(data.joined))
        } catch (error) {
            console.error(error.message)
            if (!error?.responds && error.request) {
                alert("Network Error")
            }
            updateFollowingStatus(!incFollowers)
            if (incFollowers) {
                setFollowersList(() =>
                    followersList.filter((_user) => _user._id !== user._id),
                )
            } else {
                setFollowersList(() => [user, ...followersList])
            }
        }
    }

    function updateFollowingStatus(increment) {
        updateProfileStateData((profile) => {
            let followersCount = profile.stats.followers.stats
            if (increment) followersCount++
            else followersCount--
            return {
                stats: {
                    ...profile.stats,
                    followers: {
                        ...followers,
                        data: followersList,
                        stats: followersCount,
                    },
                },
            }
        })
    }

    return (
        <>
            <div className="h-max flex justify-center items-center flex-col gap-2 sm:gap-0">
                <div className="relative">
                    {account?.avatar && (
                        <Image
                            alt="user profile avatar"
                            width={100}
                            height={100}
                            src={getUserAvatarUrl(
                                account.avatar,
                                account._id === user?._id,
                            )}
                            className="rounded-full"
                        />
                    )}
                    <div className="absolute bottom-0 left-full">
                        {myAccount === null ? (
                            ""
                        ) : (
                            <>
                                {myAccount ? (
                                    <button
                                        onClick={() => toggleEdit(true)}
                                        title="Profile Settings"
                                        className="p-2 aspect-[1] transition hover:bg-opacity-25 hover:bg-blue-400 bg-opacity-25 leading-none inline-flex justify-center items-center rounded-full bg-gray-400"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px"
                                            y="0px"
                                            fill="currentColor"
                                            width=".9em"
                                            height=".9em"
                                            viewBox="0 0 92 92"
                                            enableBackground="new 0 0 92 92"
                                            space="preserve"
                                        >
                                            <path
                                                d="M89.1,6.1l-3.2-3.2C84,1,81.6,0,78.9,0c0,0,0,0,0,0c-2.7,0-5.1,1-7,2.9L8.7,66.2c-0.4,0.4-0.7,0.8-0.9,1.4
    L0.3,86.5C-0.3,88,0,89.7,1.2,90.8C1.9,91.6,3,92,4,92c0.5,0,1-0.1,1.5-0.3l19-7.4c0.5-0.2,1-0.5,1.4-0.9l63.3-63.3
    C93,16.3,93,10,89.1,6.1z M14.8,71.7l5.6,5.6l-9.3,3.6L14.8,71.7z M83.4,14.5L28.2,69.7l-5.8-5.8L77.5,8.6C78,8.1,78.6,8,78.9,8
    s0.9,0.1,1.4,0.6l3.2,3.2C84.2,12.5,84.2,13.7,83.4,14.5z"
                                            />
                                        </svg>
                                    </button>
                                ) : (
                                    <div className="pl-4 pb-1 w-max">
                                        <button
                                            title={
                                                isFollowing
                                                    ? "Unfollow "
                                                    : "Follow " +
                                                          account.name ||
                                                      account.username
                                            }
                                            onClick={followProfile}
                                            className={`rounded-md bg-${
                                                isFollowing ? "red" : "blue"
                                            }-500 px-2 py-1
                                                bg-opacity-40 hover:bg-opacity-100 transition font-semibold`}
                                        >
                                            {isFollowing
                                                ? "Unfollow"
                                                : "+ Follow"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="text-center mt-1 leading-none">
                    <h2 className="font-bold md:text-lg tracking-wide sm:pt-2">
                        {account.name}
                    </h2>
                    <h5 className="text-gray-300 font-semibold text-sm md:text-[1em] leading-none">
                        @{account.username}
                    </h5>
                </div>
            </div>
        </>
    )
}
