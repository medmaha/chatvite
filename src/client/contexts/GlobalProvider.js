import React, { useContext, useEffect, useRef, useState } from "react"
import Navbar from "../components/UI/nav/Navbar"
import { CreateRoom, Modal } from "../components/UI/layouts"
import { GlobalContext } from "./index"
import { useSession } from "next-auth/react"
import HostedChats from "../components/UI/layouts/chats"
import { useRouter } from "next/router"

import Pending from "../components/UI/Pending"
import Alert from "../components/UI/Alert"

export default function GlobalProvider({ children }) {
    const [createRoom, setCreateRoom] = useState(false)
    const [_alert, alertOptions] = useState({ open: false })
    const [viewPrivateChats, toggleViewPrivateChats] = useState(false)
    const [user, setUser] = useState(undefined)

    const session = useSession()

    const alertDialogRef = useRef()

    useEffect(() => {
        const element = alertDialogRef.current
        const hasBeenNotified = Boolean(localStorage.getItem("HBN"))
        if (hasBeenNotified === false) {
            element?.showModal()
            localStorage.setItem("HBN", "1")
        }
        return () => element?.close()
    }, [])

    useEffect(() => {
        if (session.data?.user) {
            setUser(session.data.user)
        } else {
            setUser(null)
        }
    }, [session])

    useEffect(() => {
        if (viewPrivateChats) {
            setCreateRoom(false)
        }
        if (createRoom) {
            toggleViewPrivateChats(false)
        }
    }, [viewPrivateChats, createRoom])

    function newAlertEmit(data) {
        if (data === false) {
            alertOptions({ open: false })
        }
        if (data.text) {
            alertOptions((prev) => ({ ...data, open: true, show: true }))
        }
    }

    function toggleDrawer() {}

    return (
        <GlobalContext.Provider
            value={{
                user,
                alert: _alert,
                setUser,
                createRoom,
                toggleDrawer,
                newAlertEmit,
                setCreateRoom,
                viewPrivateChats,
                toggleViewPrivateChats,
            }}
        >
            <dialog
                ref={alertDialogRef}
                className="transition duration-300 backdrop:backdrop-blur-[1px] backdrop:bg-black backdrop:bg-opacity-20 max-w-[400px] text-white bg-blue-500 rounded-lg"
            >
                <div className="block min-w-[250px] min-h-[200px]">
                    <h2 className="font-bold text-3xl tracking-wide pb-2">
                        New Updates
                    </h2>
                    <span className="divider my-1 bg-white"></span>
                    <p className="tracking-wide font-semibold max-w-[50ch] pt-4">
                        I&apos;ve added quite new interesting features to the
                        platform. To promote engagement, interactions and more.
                    </p>
                    <ul className="grid grid-cols-1 gap-4 pt-4 list-disc">
                        <li className="inline-flex gap-1 items-start">
                            <span className="text-sm font-semibold opacity-70">
                                1.
                            </span>
                            <div className="inline-grid grid-cols-1">
                                <p className="font-bold text-sm tracking-wide">
                                    Rooms route
                                </p>
                                <p className="max-w-[45ch] text-xs tracking-wide">
                                    The ability to view all rooms tha
                                    you&apos;re currently participating
                                </p>
                            </div>
                        </li>
                        <li className="inline-flex gap-1 items-start">
                            <span className="text-sm font-semibold opacity-70">
                                2.
                            </span>
                            <div className="inline-grid grid-cols-1">
                                <p className="font-bold text-sm tracking-wide">
                                    Topics and Activities route
                                </p>
                                <p className="max-w-[45ch] text-xs tracking-wide">
                                    View all trending topics and discover every
                                    activity going on in a particular room.
                                </p>
                            </div>
                        </li>
                        <li className="inline-flex gap-1 items-start">
                            <span className="text-sm font-semibold opacity-70">
                                3.
                            </span>
                            <div className="inline-grid grid-cols-1">
                                <p className="font-bold text-sm tracking-wide">
                                    Enhanced your real time experience
                                </p>
                                <p className="max-w-[45ch] text-xs tracking-wide">
                                    Your chat experience has just gotten better,
                                    with <b>Faster Response</b> from your AI
                                    counterpart and other human friends.
                                </p>
                            </div>
                        </li>
                    </ul>
                    <div className="pt-8 px-2 flex justify-center items-center">
                        <button
                            onClick={() => {
                                alertDialogRef.current?.close()
                            }}
                            className="w-full p-1 font-semibold text-xl bg-blue-700 rounded-3xl border-none focus:border-none outline-none focus:outline focus:outline-white"
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </dialog>
            {session.status === "loading" ? (
                <div
                    style={{ height: "100vh" }}
                    className="bg-gray-800 text-gray-200 min-h-[100vh] block"
                >
                    <Pending h={"100vh"} />
                </div>
            ) : (
                <>{user !== undefined && <App>{children}</App>}</>
            )}
        </GlobalContext.Provider>
    )
}

function App({ children }) {
    const {
        createRoom,
        viewPrivateChats,
        setCreateRoom,
        toggleViewPrivateChats,
        alert,
        newAlertEmit,
    } = useContext(GlobalContext)

    const router = useRouter()

    function handlerRouteChange() {
        setCreateRoom(false)
        toggleViewPrivateChats(false)
    }

    useEffect(() => {
        if (document.readyState === "complete") {
            router.events.on("routeChangeStart", handlerRouteChange)
            return () =>
                router.events.off("routeChangeStart", handlerRouteChange)
        }
    }, [router])

    return (
        <div className="bg-gray-800 text-gray-200 h-full w-full min-h-[100vh]">
            <Navbar />
            {alert?.open && (
                <Alert
                    text={alert.text}
                    onCloseCallback={() => {
                        newAlertEmit(false)
                    }}
                    {...alert}
                />
            )}
            <div id="_topElement" className="w-full h-[65px] mb-2"></div>
            {createRoom && <CreateRoom />}
            {viewPrivateChats && (
                <HostedChats
                    onClose={(cb) => {
                        toggleViewPrivateChats(false)
                        if (cb) {
                            cb()
                        }
                    }}
                />
            )}
            <div className="w-full px-2 lg:px-8 mx-auto">{children}</div>
        </div>
    )
}
