import React, { useEffect, useState } from "react"

export default function Alert({
    invalid = false,
    success = false,
    text = "New Info",
}) {
    const [open, toggleOpen] = useState(false)

    useEffect(() => {})

    return (
        <div className="fixed top-[80px] z-20 left-0 w-full text-center px-2">
            <div
                className={`
                flex justify-center items-center font-semibold max-w-[600px] p-2 py-4 mx-auto shadow-2xl rounded-lg m 7
                ${invalid && "bg-red-400"}
                 ${!invalid && success && "bg-green-500"}
                 ${!success && !invalid && "bg-gray-500"}
                  tracking-wide text-lg`}
            >
                {text}
            </div>
        </div>
    )
}
