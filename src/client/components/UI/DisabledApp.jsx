import React, { useContext } from "react"
import Subscription from "./Subscription"
import { GlobalContext } from "../../contexts"

export default function DisabledApp() {
    const { user } = useContext(GlobalContext)
    return (
        <div className="mx-auto max-w-[550px] px-2 block">
            <p className="text-center p-2 bg-sky-600">
                Hello
                <b>
                    {user ? ", " : ""}
                    {user?.name || user?.username || ""}
                </b>
                ! We’re sorry but our site is currently experiencing high demand
                and we are working hard to fix it. We apologize for any
                inconvenience this may cause and appreciate your patience.
                Please check back soon for updates.
            </p>

            <div className="flex justify-center items-center mt-4">
                <span className="block h-[1px] w-[30%] bg-gray-600"></span>
                <span className="block px-2 text-gray-600">Or</span>
                <span className="block h-[1px] w-[30%] bg-gray-600"></span>
            </div>

            <Subscription />
        </div>
    )
}
