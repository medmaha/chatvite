import React, { useState, useLayoutEffect, useContext } from "react"
import { format } from "date-fns"
import { GlobalContext } from "../../../contexts"
import Image from "next/image"
import Link from "next/link"
import DateFormatter from "../../UI/layouts/DateFormatter"

export default function Chat({ fuse: chat }) {
    const { user } = useContext(GlobalContext)

    const [myFuse, setMyFuse] = useState(false)

    useLayoutEffect(() => {
        const me = (() => {
            if (user?._id === chat.sender._id) return true
            return false
        })()

        setMyFuse(me)
    }, [user, chat])

    function transFormTextUrl(text) {
        const urlRegex = /(https?:\/\/[^\s]+\w)/g
        const urls = text.match(urlRegex)
        if (urls) {
            urls.forEach((url) => {
                text = text.replace(
                    url,
                    `<a href="${url}" target='blank' class="text-sky-500 cursor-pointer">${url}</a>`,
                )
            })
        }
        const mentionRegex = /@[^\s]+/gi
        const mentions = text.match(mentionRegex)
        if (mentions) {
            mentions.forEach((mention) => {
                text = text.replace(
                    mention,
                    `<span class="px-0.5 bg-slate-700 text-xs rounded-[2px]">${mention}</span>`,
                )
            })
        }
        return text
    }

    return (
        <div
            data-chat-fuse
            className={` border-gray-6_00 border-solid p-2 mb-2 h-max ${
                myFuse ? "border-r-[2px] myFuse" : "border-l-[2px]"
            }`}
            style={{
                borderColor: convertNameToColor(chat.sender?.username || ""),
            }}
        >
            <div className={`flex gap-2 w-full ${myFuse && "justify-end"} `}>
                <div className={`${myFuse && "order-last"}`}>
                    {!myFuse && (
                        <Link
                            href={`/profile/${chat.sender.username}`}
                            className="inline-block w-[35px] h-[35px] rounded-full bg-gray-800 border-solid border-blue-400 border-[1px]"
                        >
                            <Image
                                width={35}
                                height={35}
                                alt="sender avatar"
                                src={chat.sender.avatar}
                                className="rounded-full"
                            />
                        </Link>
                    )}
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
                            <Link
                                href={`/profile/${chat.sender.username}`}
                                className="font-bold"
                            >
                                {chat.sender._id !== user?._id ? (
                                    <>
                                        {chat.sender.name === "AI" ? (
                                            "AI"
                                        ) : (
                                            <>
                                                {chat.sender.name ||
                                                    chat.sender.username}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <b>Me</b>
                                )}
                            </Link>
                        </p>
                    </div>
                    <div
                        className={`break-words flex flex-col gap-1 ${
                            myFuse
                                ? "pl-[10%] sm:pl-[20%] md:pl-[30%] lg:pl-[40%]"
                                : "pr-[10%] sm:pr-[20%] md:pr-[30%] lg:pr-[40%]"
                        }`}
                    >
                        <div
                            className={`text-slate-300 text-sm font-semibold flex tracking-wider ${
                                myFuse && "justify-end"
                            }`}
                        >
                            <p
                                className={`break-words float-right ${
                                    myFuse ? " text-right " : ""
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: transFormTextUrl(chat.fuse),
                                }}
                            >
                                {/* {transFormTextUrl(chat.fuse)} */}
                            </p>
                        </div>
                        <p
                            data-fuse-failed
                            className={`text-red-400 flex unsent gap-4 items-center text-sm font-semibold tracking-wide ${
                                myFuse && "justify-end"
                            }`}
                        >
                            <span className={`${myFuse && "order-last_"}`}>
                                Failed to make fuse
                            </span>
                            <button title="Resend Msg p-1">
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
                            {chat.createdAt && (
                                <span
                                    className="'text-sm"
                                    title={format(
                                        new Date(chat.createdAt),
                                        "PPPPpp",
                                    )}
                                >
                                    <DateFormatter
                                        data={chat.createdAt}
                                        distance
                                    />
                                </span>
                            )}
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
