import React, { useContext, useEffect, useRef, useState } from "react"
import { GlobalContext } from "../../../contexts"
import { signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"

import { getUserAvatarUrl } from "../../../../utils/index"

export default function NavProfile() {
    const [dropdown, toggleDropdown] = useState(false)
    const { user } = useContext(GlobalContext)

    const dropdownRef = useRef()
    const router = useRouter()

    function logoutAccount() {
        if (user) {
            signOut({ redirect: "/feed" })
            localStorage.removeItem("avatar")
        }
    }

    useEffect(() => {
        router.events.on("routeChangeStart", () => {
            toggleDropdown(false)
        })
    }, [])

    function handleDropdownClick(ev) {
        if (ev.target.closest("[data-nav-profile]")) return
        if (ev.target.closest("[data-nav-dropdown]")) return
        if (ev.target.hasAttribute("data-nav-dropdown")) return
        handleEvent()
    }
    function handleEvent() {
        toggleDropdown(false)
    }

    useEffect(() => {
        if (dropdown) {
            const element = dropdownRef.current

            element.addEventListener("mouseleave", handleEvent)
            document.addEventListener("click", handleDropdownClick)

            return () => {
                document.removeEventListener("click", handleDropdownClick)
                element.removeEventListener("mouseleave", handleEvent)
            }
        }
    }, [dropdown])

    return (
        <div data-nav-profile className="flex items-center gap-4">
            {!user ? (
                <div className="flex items-center gap-2 px-4">
                    <Link
                        href="/auth/login"
                        className="px-3 py-1 rounded-full text-sky-500 font-bold tracking-wider transition-[outline] hover:outline-[1px] hover:outline outline-sky-500"
                    >
                        Login
                    </Link>
                    <Link
                        href="/auth/signup"
                        className="px-3 py-1 rounded-full bg-sky-500"
                    >
                        Signup
                    </Link>
                </div>
            ) : (
                <div className="profile inline-block shrink-0 w-max">
                    <div className="flex gap-2 md:gap-4 items-center" id="">
                        <button
                            onClick={() => toggleDropdown(!dropdown)}
                            className="inline-block sm:hidden w-[45px] h-[45px] rounded-full bg-gray-800 border-solid border-gray-600 border-[1px]"
                        >
                            <Image
                                className="rounded-full"
                                alt="avatar"
                                src={getUserAvatarUrl(user.avatar, true)}
                                width={45}
                                height={45}
                            />
                        </button>
                        <Link
                            href={"/profile/" + user.username}
                            className="hidden sm:inline-block w-[45px] h-[45px] rounded-full bg-gray-800 border-solid border-gray-600 border-[1px]"
                        >
                            <Image
                                className="rounded-full"
                                alt="avatar"
                                src={getUserAvatarUrl(user.avatar, true)}
                                width={45}
                                height={45}
                            />
                        </Link>

                        <div className="inline-block relative">
                            <button
                                onClick={() => toggleDropdown(!dropdown)}
                                className="text-blue-400 hidden sm:inline-flex hover:text-blue-500 font-semibold text-sm tracking-wide gap-2 items-center"
                            >
                                {/* <span className="sm:hidden">@{user.username}</span> */}
                                <span className="hidden sm:inline-block">
                                    @{user.username}
                                </span>
                                <span>
                                    <svg
                                        fill="currentColor"
                                        width={"1em"}
                                        height={"1em"}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 2048 2048"
                                    >
                                        <path d="M1939 467l90 90-1005 1005L19 557l90-90 915 915z" />
                                    </svg>
                                </span>
                            </button>
                            {dropdown && (
                                <div
                                    data-nav-dropdown
                                    ref={dropdownRef}
                                    className="absolute top-[calc(100%+10px)] sm:top-full right-0 w-max"
                                >
                                    <div className="mt-5 bg-gray-600 pt-2 px-4 pb-4 shadow-xl rounded-sm shadow-gray-800">
                                        <div className="inline-flex pb-2 flex-col items-center justify-center w-full">
                                            <span className="text-center inline-block w-[20ch] truncate">
                                                {user.name}
                                            </span>
                                            <span
                                                className={`text-center text-sm inline-block w-[20ch] truncate ${
                                                    user.name
                                                        ? "text-gray-400"
                                                        : ""
                                                }`}
                                            >
                                                {/* Signed in as{" "} */}
                                                <b className="">
                                                    @{user.username}
                                                </b>{" "}
                                            </span>
                                        </div>
                                        <div className="flex mb-4 flex-col max-w-max font-semibold tracking-wide w-full gap-4">
                                            <div className="divider"></div>
                                            <div className="flex flex-col gap-4 w-[20ch]">
                                                <div className="inline-block w-full">
                                                    <Link
                                                        href={
                                                            "/profile/" +
                                                            user.username
                                                        }
                                                        className="inline-flex transition-[color] justify-between items-center w-full text-gray-300 hover:text-blue-400"
                                                    >
                                                        <span>Account</span>
                                                        <span className="">
                                                            <svg
                                                                width="1em"
                                                                height="1em"
                                                                stroke="currentColor"
                                                                // fill="none"
                                                                fill="currentColor"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" />
                                                            </svg>
                                                        </span>
                                                    </Link>
                                                </div>
                                                <div className="divider"></div>
                                                <div className="inline-block w-full">
                                                    <Link
                                                        href={"/rooms"}
                                                        className="inline-flex transition-[color] justify-between items-center w-full text-gray-300 hover:text-blue-400"
                                                    >
                                                        <span>ChatRooms</span>
                                                        <span className="">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="1em"
                                                                height="1em"
                                                                stroke="currentColor"
                                                                // fill="none"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                                                            </svg>
                                                        </span>
                                                    </Link>
                                                </div>
                                                <div className="divider"></div>
                                                <div className="inline-block">
                                                    <Link
                                                        href={"/topics"}
                                                        className="inline-flex transition-[color] justify-between items-center w-full text-gray-300 hover:text-blue-400"
                                                    >
                                                        <span>Topics</span>
                                                        <span>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="1rem"
                                                                height="1rem"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
                                                            </svg>
                                                        </span>
                                                    </Link>
                                                </div>
                                                <div className="divider"></div>
                                                <div className="inline-block">
                                                    <Link
                                                        href={"/activities"}
                                                        className="inline-flex transition-[color] justify-between items-center w-full text-gray-300 hover:text-blue-400"
                                                    >
                                                        <span>Activities</span>
                                                        <span>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="1rem"
                                                                height="1rem"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z" />
                                                            </svg>
                                                        </span>
                                                    </Link>
                                                </div>
                                                <div className="divider"></div>
                                                <div className="inline-block">
                                                    <Link
                                                        href={"/account/logout"}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            logoutAccount()
                                                        }}
                                                        className="inline-flex transition-[color] justify-between items-center w-full text-gray-300 hover:text-blue-400"
                                                    >
                                                        <span>Logout</span>
                                                        <span>
                                                            <svg
                                                                stroke="currentColor"
                                                                // fill="none"
                                                                fill="currentColor"
                                                                fillOpacity=".5"
                                                                strokeWidth="2"
                                                                viewBox="0 0 24 24"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="h-4 w-4"
                                                                height="1em"
                                                                width="1em"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                                <polyline points="16 17 21 12 16 7"></polyline>
                                                                <line
                                                                    x1="21"
                                                                    y1="12"
                                                                    x2="9"
                                                                    y2="12"
                                                                ></line>
                                                            </svg>
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="divider"></span>
                                        <div className="pt-2">
                                            <p className="text-xs text-gray-400">
                                                Copyright © 2023 ChatVite Inc.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
