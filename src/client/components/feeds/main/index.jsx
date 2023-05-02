import React, { useContext, useEffect, useLayoutEffect, useState } from "react"
import RoomCollections from "./RoomCollections"
import { GlobalContext } from "../../../contexts"
import { useRouter } from "next/router"
import axios from "axios"
import Pending from "../../UI/Pending"

export default function Main({ feeds: data, onInit, fetchFeeds }) {
    const { setCreateRoom } = useContext(GlobalContext)
    const [feeds, setFeeds] = useState([])
    const [pending, setPending] = useState(false)
    const router = useRouter()

    useLayoutEffect(() => {
        if (!!window.location.pathname.match(/\/feed/)) {
            const url = window.location.href
            const queryString = url.split("?")[1]
            if (queryString) {
                _fetchFeeds({ q: "?" + queryString })
            } else {
                setFeeds(data)
            }
        }
    }, [])
    useLayoutEffect(() => {
        setFeeds(data)
    }, [data])

    function handleQueryParamSearchOnRouteChange(url, { shallow }) {
        const feedRoute = url.split("?")[0] === "/feed"

        if (shallow) {
            const queryString = url.split("?")[1]
            _fetchFeeds({ q: "?" + queryString })
        } else {
            if (feedRoute) _fetchFeeds()
        }
    }

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
    }, [])

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

    async function _fetchFeeds(_data = {}) {
        setPending(true)
        try {
            await fetchFeeds(_data)
        } catch (error) {
            console.error(error)
        } finally {
            setPending(false)
        }
    }

    return (
        <div className="">
            <div className="flex justify-around mt-1">
                <div className="lg:order-first order-last">
                    <h4>Chat Rooms</h4>
                    <p className="text-gray-400">85 rooms available</p>
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
