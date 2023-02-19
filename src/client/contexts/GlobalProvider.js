import React, { useContext, useState } from "react"
import { Navbar, CreateRoom } from "../components/UI/layouts"
import { GlobalContext } from "./index"
import { useSession } from "next-auth/react"

export default function GlobalProvider({ children }) {
    const [createRoom, setCreateRoom] = useState(false)

    const session = useSession()
    const user = session.data?.user

    return (
        <GlobalContext.Provider value={{ user, createRoom, setCreateRoom }}>
            {session.status !== "loading" && <App>{children}</App>}
        </GlobalContext.Provider>
    )
}

function App({ children }) {
    const { createRoom } = useContext(GlobalContext)
    return (
        <div className="bg-gray-800 text-gray-200 h-full w-full min-h-[100vh]">
            <Navbar />
            <div className="w-full h-[65px] mb-2"></div>

            {createRoom && <CreateRoom />}

            <div className="w-full px-2 lg:px-8 mx-auto">{children}</div>
        </div>
    )
}
