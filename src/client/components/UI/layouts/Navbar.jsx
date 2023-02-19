import Link from "next/link"
import React, { useContext } from "react"
import { GlobalContext } from "../../../contexts"
import Image from "next/image"

export default function Navbar() {
    const { user } = useContext(GlobalContext)
    return (
        <nav className="bg-gray-700 fixed top-0 left-0 w-full h-[65px] z-10 shadow-lg px-2">
            <div className="container h-full mx-auto flex items-center">
                <div className="h-full w-full flex gap-2 items-center justify-between">
                    <div className="brand inline-flex">
                        <h1 className="">
                            <Link
                                href="/feed"
                                className="font-bold text-lg tracking-wider"
                            >
                                FuseChat
                            </Link>
                        </h1>
                    </div>

                    <form className="form max-w-[400px] flex-1 inline-block">
                        <input
                            type="search"
                            placeholder="Search"
                            className="w-full p-2 rounded-md bg-gray-800 text-gray-300"
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
                                <div className="flex gap-2" id="">
                                    <button className="user w-[45px] h-[45px] rounded-full bg-gray-800 border-solid border-gray-600 border-[1px]">
                                        <Image
                                            className="rounded-full"
                                            alt="avatar"
                                            src={"/images/avatar.png"}
                                            width={45}
                                            height={45}
                                        />
                                    </button>

                                    <button className="text-blue-400 font-semibold text-sm tracking-wide">
                                        @{user.username}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
