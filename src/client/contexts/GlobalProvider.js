import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/UI/Navbar"
import { CreateRoom, Modal } from "../components/UI/layouts"
import { GlobalContext } from "./index"
import { useSession } from "next-auth/react"

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
                "Loading..."
            ) : (
                <>{user !== undefined && <App>{children}</App>}</>
            )}
        </GlobalContext.Provider>
    )
}

function App({ children }) {
    const { createRoom, viewPrivateChats, toggleViewPrivateChats } =
        useContext(GlobalContext)
    return (
        <div className="bg-gray-800 text-gray-200 h-full w-full min-h-[100vh]">
            <Navbar />
            <div className="w-full h-[65px] mb-2"></div>
            {createRoom && <CreateRoom />}
            {viewPrivateChats && (
                <Modal
                    title="Your Private Chats"
                    onClose={(cb) => {
                        toggleViewPrivateChats(false)
                        if (cb) {
                            cb()
                        }
                    }}
                    content={
                        <div className="w-full h-full block flex-col bg-red-200">
                            <p>Loading</p>
                        </div>
                    }
                />
            )}
            <div className="w-full px-2 lg:px-8 mx-auto">{children}</div>
        </div>
    )
}
