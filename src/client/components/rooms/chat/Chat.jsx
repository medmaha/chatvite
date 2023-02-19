import React, { useState, useLayoutEffect } from "react"
import { useSession } from "next-auth/react"

export default function Chat({ fuse }) {
    const session = useSession()

    const [myFuse, setMyFuse] = useState(false)

    useLayoutEffect(() => {
        const me = (() => {
            if (session.data?.user?.id === fuse.sender.id) return true
            return false
        })()

        setMyFuse(me)
    }, [])

    return (
        <div
            data-chat-fuse
            className={` border-gray-6_00 border-solid p-2 mb-2 ${
                myFuse ? "border-r-[2px] myFuse" : "border-l-[2px]"
            }`}
            style={{
                borderColor: convertNameToColor(fuse.sender?.username || ""),
            }}
        >
            <div className={`flex gap-2 w-full ${myFuse && "justify-end"} `}>
                <div className={`${myFuse && "order-last"}`}>
                    <button className="user w-[35px] h-[35px] rounded-full bg-gray-800 border-solid border-blue-400 border-[1px]">
                        <span></span>
                    </button>
                </div>
                <div className="inline-flex flex-col justify-start w-full">
                    <div
                        className={`flex gap-4 items-center ${
                            myFuse && "justify-end"
                        }`}
                    >
                        <p
                            className={`text-gray-300 p-0 font-semibold ${
                                myFuse && "order-last"
                            }`}
                        >
                            <button className="font-bold">
                                {fuse.sender.username === "AI" ? (
                                    "AI"
                                ) : (
                                    <>
                                        {fuse.sender.name ||
                                            fuse.sender.username}
                                    </>
                                )}
                            </button>
                        </p>
                    </div>
                    <div className={`${myFuse ? "pl-[40%]" : "pr-[40%]"}`}>
                        <p
                            className={`text-gray-300 text-sm font-semibold tracking-wide flex ${
                                myFuse && "justify-end"
                            }`}
                        >
                            {fuse.fuse}
                        </p>
                        <p
                            className={`text-red-400 unsent gap-4 items-center text-sm font-semibold tracking-wide flex ${
                                myFuse && "justify-end"
                            }`}
                        >
                            <span className={`${myFuse && "order-last_"}`}>
                                Failed to make fuse
                            </span>
                            <button title="Resend Msg">
                                <span>
                                    <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                </span>
                            </button>
                        </p>
                        <div
                            className={`inline-flex w-full updatedAt text-sm text-gray-500 ${
                                myFuse && "justify-end"
                            }`}
                        >
                            <span> 3hrs ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function convertNameToColor(str) {
    // Hash the input string to a number
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Calculate hue, saturation, and lightness from the hash value
    let hue = hash % 360
    let saturation = 50 + (hash % 10)
    let lightness = 30 + (hash % 10)

    // Convert HSL to RGB
    let c = (1 - Math.abs(2 * lightness - 1)) * saturation
    let x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
    let m = lightness - c / 2
    let r, g, b
    if (hue < 60) {
        r = 0
        g = x
        b = 0
    } else if (hue < 120) {
        r = x
        g = c
        b = 0
    } else if (hue < 180) {
        r = 0
        g = c
        b = x
    } else if (hue < 240) {
        r = 0
        g = x
        b = c
    } else if (hue < 300) {
        r = 0
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    let alpha = "0.4"

    // Return the color as a CSS string
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")"
}
