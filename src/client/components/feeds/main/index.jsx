import React, {
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react"
import RoomCollections from "./RoomCollections"
import { GlobalContext } from "../../../contexts"
import { useRouter } from "next/router"
import axios from "axios"
import Pending from "../../UI/Pending"
import Link from "next/link"

export default function Main({ feeds: data, onInit, fetchFeeds, roomsCount }) {
    const { setCreateRoom } = useContext(GlobalContext)
    const [feeds, setFeeds] = useState(data)
    const [pending, setPending] = useState(false)

    const router = useRouter()

    const dialogRef = useRef()

    const _fetchFeeds = useCallback(
        async (_data = {}) => {
            setPending(true)
            try {
                await fetchFeeds(_data)
            } catch (error) {
                console.error(error)
            } finally {
                setPending(false)
            }
        },
        [fetchFeeds],
    )

    useLayoutEffect(() => {
        if (!!window.location.pathname.match(/\/feed/)) {
            const url = window.location.href
            const queryString = url.split("?")[1]
            if (queryString) {
                _fetchFeeds({ q: "?" + queryString })
            }
        }
    }, [_fetchFeeds])

    useLayoutEffect(() => {
        setFeeds(data)
    }, [data])

    const handleQueryParamSearchOnRouteChange = useCallback(
        (url, { shallow }) => {
            const feedRoute = url.split("?")[0] === "/feed"

            if (shallow) {
                const queryString = url.split("?")[1]
                _fetchFeeds({ q: "?" + queryString })
            } else {
                if (feedRoute) _fetchFeeds()
            }
        },
        [_fetchFeeds],
    )

    useEffect(() => {
        router.events.on(
            "routeChangeStart",
            handleQueryParamSearchOnRouteChange,
        )

        return () =>
            router.events.off(
                "routeChangeStart",
                handleQueryParamSearchOnRouteChange,
            )
    }, [handleQueryParamSearchOnRouteChange, router])

    useEffect(() => {
        document.addEventListener("room", updateFeedFromCreate)
        return () => document.removeEventListener("room", updateFeedFromCreate)
    }, [])

    function updateFeedFromCreate(ev) {
        const data = ev.detail?.data

        if (data) {
            setFeeds((prev) => {
                return [data, ...prev]
            })
        }
    }

    const toggleDrawer = useCallback(() => {
        if (!dialogRef.current?.open) dialogRef.current?.showModal()
        // else dialogRef.current?.close
    }, [])

    return (
        <div className="">
            <dialog
                ref={dialogRef}
                className="text-gray-100 min-w-[250px]  p-0 bg-gray-700 backdrop:backdrop-blur-[1px] backdrop:bg-opacity-10 backdrop:bg-black border border-gray-400 rounded-md"
            >
                <div className="py-2 flex justify-between items-center gap-4 border-b border-gray-400 px-2">
                    <h3 className="text-lg font-semibold tracking-wide">
                        Menu
                    </h3>
                    <button
                        title="Close Menu"
                        onClick={(ev) => {
                            ev.target.closest("dialog")?.close()
                        }}
                        className="text-[larger] w-8 h-8 inline-flex items-center justify-center rounded shadow-md hover:text-red-400"
                    >
                        &times;
                    </button>
                </div>
                <ul
                    className="flex flex-col w-full py-4 px-2 space-y-2"
                    onClick={(ev) => {
                        ev.target.closest("dialog")?.close()
                    }}
                >
                    {["Home", "Rooms", "Topics", "Activities"].map(
                        (link, i) => {
                            return (
                                <li key={link} className="inline-block w-full">
                                    <Link
                                        href={`/${
                                            link === "Home"
                                                ? "feed"
                                                : link.toLowerCase()
                                        }`}
                                        className={`inline-block w-full p-2 hover:bg-blue-500 transition-all rounded ${
                                            i % 2 === 0
                                                ? "bg-gray-800"
                                                : "bg-transparent"
                                        }`}
                                    >
                                        {link}
                                    </Link>
                                </li>
                            )
                        },
                    )}
                </ul>
            </dialog>
            <div className="flex justify-between md:justify-around mt-1 items-center">
                <div className="block md:order-last">
                    <button
                        onClick={toggleDrawer}
                        title="Menu"
                        className="inline-flex items-center justify-center rounded hover:bg-opacity-70 duration-300 hover:text-white transition-all w-8 h-8 bg-opacity-20 bg-blue-400"
                    >
                        <span className="mx-auto inline-block">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current"
                            >
                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                            </svg>
                        </span>
                    </button>
                </div>
                <div className="md:order-[2] order-last text-center pr-1">
                    <h4>Chat Rooms</h4>
                    <p className="text-gray-400">
                        {roomsCount} rooms available
                    </p>
                </div>
                <div className="">
                    <button
                        title="Create Chat Room"
                        className="btn bg-blue-400 hover:bg-blue-500 transition px-3 py-2 rounded-md text-lg "
                        onClick={() => setCreateRoom(true)}
                    >
                        <b className="text-2xl leading-none">+</b>{" "}
                        <span className="font-semibold">Chatroom</span>
                    </button>
                </div>
            </div>

            <div className="mt-4 h-full">
                {pending ? (
                    <Pending h={"350px"} />
                ) : (
                    <>
                        {!!feeds.length ? (
                            <RoomCollections feeds={feeds} onInit={onInit} />
                        ) : (
                            <div className="h-[400px] w-full flex items-center justify-center">
                                <div className="animate-pulse transition text-lg font-bold tracking-wider">
                                    {(() => {
                                        const url = window.location.href.split(
                                            window.location.host,
                                        )[1]

                                        const queryString = url?.split("?")[1]

                                        if (queryString) {
                                            var query = ""
                                            var availableQuery = []
                                            var idx = 0
                                            for (const q of queryString.split(
                                                "&",
                                            )) {
                                                const [key, value] =
                                                    q.split("=")

                                                if (["search"].includes(key)) {
                                                    query = value
                                                    break
                                                } else {
                                                    availableQuery.push(key)
                                                    idx++
                                                }
                                            }
                                            if (query)
                                                return `No results for "${query}"`

                                            if (
                                                availableQuery.includes("q") &&
                                                idx < 1
                                            )
                                                return "Query Not Found"
                                        }
                                        if (location.pathname === "/feed")
                                            return "Not rooms to show.\n Create one now!"
                                        return "Not Found"
                                    })()}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
