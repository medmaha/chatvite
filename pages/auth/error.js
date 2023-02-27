import Link from "next/link"
import React from "react"

export default function error() {
    return (
        <div className="h-[70vh] w-full flex items-center justify-center">
            <div className="p-3 m-1 bg-gray-700 min-w-[200px] min-h-[200px] flex flex-col justify-evenly w-full max-w-[400px] rounded-xl">
                <div className="text-center flex flex-col gap-2 justify-center items-center">
                    <p className="font-bold text-xl text-center w-full tracking-wide">
                        Invalid Credentials
                    </p>
                    <p className="text-sm text-center w-full text-slate-400 max-w-[35ch]">
                        The credentials you provided does not match our database
                    </p>
                </div>
                <div className="pt-4 flex justify-center">
                    <Link
                        href={"/auth/login"}
                        className="px-3 py-2 rounded-lg font-semibold bg-blue-400 hover:bg-blue-500 transition"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        </div>
    )
}
