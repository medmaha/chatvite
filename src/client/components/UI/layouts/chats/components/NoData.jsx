import React from "react"
import Link from "next/link"

export default function NoData({ room }) {
    return (
        <div className="flex justify-center flex-col gap-2 items-center m-h-[250px] font-bold text-lg pt-4 sm:pt-8">
            <h3>
                <span>No {room} Rooms!</span>
            </h3>
            <p className="text-center text-sm tracking-wider font-semibold max-w-[50ch]">
                You haven&apos;t hosted any{" "}
                <b className="">{room.toLowerCase()}</b> rooms yet, perhaps you
                might want to go to{" "}
                <Link
                    href={"/feeds"}
                    className="text-sky-400 hover:text-sky-400 transition"
                >
                    homepage
                </Link>{" "}
                and create a new <b>ChatRoom</b>.
            </p>
        </div>
    )
}
