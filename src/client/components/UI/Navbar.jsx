import React, { useContext, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut, signIn, getSession } from "next-auth/react"
import { GlobalContext } from "../../contexts"

import { useRouter } from "next/router"
import { getUserAvatarUrl } from "../../../utils"

export default function Navbar() {
    const { user, toggleViewPrivateChats } = useContext(GlobalContext)
    const router = useRouter()
    const [dropdown, toggleDropdown] = useState(false)
    const dropdownRef = useRef()

    function logoutAccount() {
        if (user) {
            signOut({ redirect: "/feed" })
            localStorage.removeItem("avatar")
        }
    }

    useEffect(() => {
        if (dropdown) {
            const element = dropdownRef.current

            function handleEvent() {
                toggleDropdown(false)
            }

            element.addEventListener("mouseleave", handleEvent)

            return () => element.removeEventListener("mouseleave", handleEvent)
        }
    }, [dropdown])

    useEffect(() => {
        router.events.on("routeChangeStart", () => {
            toggleDropdown(false)
        })
    }, [])

    function handleSearch(ev) {
        ev.preventDefault()
        const search = ev.target.search.value
        router.push("/feed?search=" + search, "", { shallow: true })
    }

    return (
        <nav className="bg-gray-700 fixed top-0 left-0 w-full h-[65px] z-10 shadow-lg px-2">
            <div className="container h-full mx-auto flex items-center">
                <div className="h-full w-full flex gap-2 items-center justify-between">
                    <div className="brand inline-flex">
                        <h1 className="">
                            <Link
                                href="/feed"
                                className="font-bold text-lg tracking-wider inline-flex gap-1 items-center"
                            >
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 2330 2048"
                                        fill="currentColor"
                                        width={"1.2em"}
                                        height={"1.2em"}
                                        stroke="currentColor"
                                    >
                                        <path
                                            transform="scale(4 4) translate(0 0)"
                                            d="M491.9 105.9c-77.8-51.4-181.2-63.1-267.1-47.6C128.7-34.4 21 8.2 0 20.5c0 0 73.9 62.8 61.9 117.8-87.5 89.2-45.9 188.5 0 235.4C73.9 428.7 0 491.5 0 491.5c20.8 12.3 128.2 54.8 224.8-37.4 85.7 15.4 189.1 3.8 267.1-47.7 120.6-77 121-223.1 0-300.5zm-194.4 300c-30.1.1-60-3.8-89.1-11.5l-20 19.3c-11.1 10.8-23.6 20.1-37 27.7-16.3 8.2-34.1 13.3-52.3 14.9 1-1.8 1.9-3.6 2.8-5.3 20-37.1 25.4-70.3 16.2-99.8-32.9-25.9-52.6-59-52.6-95.2 0-82.9 103.9-150.1 232-150.1s232 67.2 232 150.1c0 82.9-103.9 149.9-232 149.9zM186.2 291.7c-19.1.3-34.9-15-35.2-34.1-.7-45.9 68.6-46.9 69.3-1.1v.5c.2 19.3-15.5 34.7-34.1 34.7zm74.6-34.1c-.8-45.9 68.5-47 69.3-1.2v.6c.4 45.6-68.5 46.1-69.3.6zm145 34.1c-19.1.3-34.9-15-35.2-34.1-.7-45.9 68.6-46.9 69.3-1.1v.5c.2 19-15 34.6-34.1 34.7z"
                                        />
                                    </svg>
                                </span>
                                <span>ChatVite</span>
                            </Link>
                        </h1>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="form max-w-[400px] flex-1 inline-block"
                    >
                        <input
                            type="search"
                            placeholder="Search"
                            name="search"
                            className="bg-gray-800 rounded-md w-full p-2 border-gray-600 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                        />
                    </form>

                    <div className="flex items-center gap-4">
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
                                <div
                                    className="flex gap-2 md:gap-4 items-center"
                                    id=""
                                >
                                    <button
                                        onClick={() =>
                                            toggleDropdown(!dropdown)
                                        }
                                        className="inline-block sm:hidden w-[45px] h-[45px] rounded-full bg-gray-800 border-solid border-gray-600 border-[1px]"
                                    >
                                        <Image
                                            className="rounded-full"
                                            alt="avatar"
                                            src={getUserAvatarUrl(
                                                user.avatar,
                                                true,
                                            )}
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
                                            src={getUserAvatarUrl(
                                                user.avatar,
                                                true,
                                            )}
                                            width={45}
                                            height={45}
                                        />
                                    </Link>

                                    <div className="inline-block relative">
                                        <button
                                            onClick={() =>
                                                toggleDropdown(!dropdown)
                                            }
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
                                                ref={dropdownRef}
                                                className="absolute top-[calc(100%+10px)] sm:top-full right-0 w-max"
                                            >
                                                <div className="mt-5 bg-gray-600 p-5 shadow-xl rounded-sm shadow-gray-800">
                                                    <div className="flex mb-4 flex-col min-w-[150px] font-semibold tracking-wide w-full gap-4">
                                                        <div className="inline-block w-full">
                                                            <button
                                                                onClick={() => {
                                                                    toggleViewPrivateChats(
                                                                        (
                                                                            prev,
                                                                        ) =>
                                                                            !prev,
                                                                    )
                                                                }}
                                                                className="inline-flex transition-[color] justify-between items-center w-full text-gray-300 hover:text-blue-400"
                                                            >
                                                                <span>
                                                                    My Chats
                                                                </span>
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
                                                            </button>
                                                        </div>
                                                        <div className="inline-block w-full">
                                                            <Link
                                                                href={
                                                                    "/profile/" +
                                                                    user.username
                                                                }
                                                                className="inline-flex transition-[color] justify-between items-center w-full text-gray-300 hover:text-blue-400"
                                                            >
                                                                <span>
                                                                    Profile
                                                                </span>
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
                                                        <div className="inline-block">
                                                            <Link
                                                                href={
                                                                    "/account/logout"
                                                                }
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault()
                                                                    logoutAccount()
                                                                }}
                                                                className="inline-flex transition-[color] justify-between items-center w-full text-gray-300 hover:text-blue-400"
                                                            >
                                                                <span>
                                                                    Logout
                                                                </span>
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
                                                    <span className="divider"></span>
                                                    <div className="pt-2">
                                                        <p className="text-xs text-gray-400">
                                                            Copyright © 2023
                                                            ChatVite Labs Inc.
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
                </div>
            </div>
        </nav>
    )
}
