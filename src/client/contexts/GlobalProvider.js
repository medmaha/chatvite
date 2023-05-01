import React, { useContext, useEffect, useState } from "react"
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
    const [viewPrivateChats, toggleViewPrivateChats] = useState(false)
    const [user, setUser] = useState(undefined)

    const session = useSession()

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

    return (
        <GlobalContext.Provider
            value={{
                user,
                setUser,
                createRoom,
                setCreateRoom,
                viewPrivateChats,
                toggleViewPrivateChats,
            }}
        >
            {session.status === "loading" ? (
                <div className="bg-gray-800 text-gray-200 min-h-[100vh]">
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
