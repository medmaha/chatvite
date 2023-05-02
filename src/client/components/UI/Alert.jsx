import React, { useEffect, useLayoutEffect, useRef, useState } from "react"

export default function Alert({
    text = "",
    show = false,
    invalid = false,
    success = false,
    duration = 5000,
    onCloseCallback = () => {},
}) {
    const [open, toggleOpen] = useState(show)
    const _alert = useRef()

    let openTimeOut
    let closeTimeOut

    useLayoutEffect(() => {
        toggleOpen(show)

        return () => {
            clearTimeout(openTimeOut)
            clearTimeout(closeTimeOut)
        }
    }, [show])

    useEffect(() => {
        if (open) {
            init()
        } else {
            exit()
        }
    }, [open])

    function init() {
        if (openTimeOut) clearTimeout(openTimeOut)
        openTimeOut = setTimeout(() => {
            _alert.current.classList.add("open")
            exit()
        }, 200)
    }

    function exit() {
        if (closeTimeOut) clearTimeout(closeTimeOut)
        if (_alert.current)
            closeTimeOut = setTimeout(() => {
                _alert.current.classList.remove("open")
                onCloseCallback()
            }, duration)
    }

    return (
        <>
            <div className="fixed top-[80px] z-20 left-0 w-full text-center px-2">
                <div
                    ref={_alert}
                    className={`
                    alert-notification
                    flex justify-center flex-col items-center font-semibold max-w-[600px] p-2 py-4 mx-auto shadow-2xl rounded-lg m 7
                    ${invalid && "bg-red-400"}
                    ${!invalid && success && "bg-green-500"}
                    ${!success && !invalid && "bg-sky-600"}
                    tracking-wide text-lg`}
                >
                    <p className="text-center">{text}</p>
                </div>
            </div>
        </>
    )
}
