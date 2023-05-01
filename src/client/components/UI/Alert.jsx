import React, { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../contexts"

export default function Alert({
    invalid = false,
    success = false,
    text = "New Info",
}) {
    const [open, toggleOpen] = useState(false)
    const { user } = useContext(GlobalContext)

    useEffect(() => {})

    return (
        <div className="fixed top-[80px] z-20 left-0 w-full text-center px-2">
            <div
                className={`
                flex justify-center items-center font-semibold max-w-[600px] p-2 py-4 mx-auto shadow-2xl rounded-lg m 7
                ${invalid && "bg-red-400"}
                 ${!invalid && success && "bg-green-500"}
                 ${!success && !invalid && "bg-sky-600"}
                  tracking-wide text-lg`}
            >
                <p className="text-center">
                    Hello
                    <b>
                        {user ? ", " : ""}
                        {user?.name || user?.username || ""}
                    </b>
                    ! We’re sorry but our site is currently experiencing high
                    demand and we are working hard to fix it. We apologize for
                    any inconvenience this may cause and appreciate your
                    patience. Please check back soon for updates.
                </p>
            </div>
        </div>
    )
}
