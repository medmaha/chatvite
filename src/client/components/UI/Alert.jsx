import React, { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../contexts"

let timeout

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
                flex justify-center flex-col items-center font-semibold max-w-[600px] p-2 py-4 mx-auto shadow-2xl rounded-lg m 7
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

            <div className="flex justify-center items-center mt-4">
                <span className="block h-[1px] w-[30%] bg-gray-600"></span>
                <span className="block px-2 text-gray-600">Or</span>
                <span className="block h-[1px] w-[30%] bg-gray-600"></span>
            </div>

            <form
                onSubmit={(ev) => {
                    ev.preventDefault()
                    const input = ev.currentTarget.querySelector("input")
                    input.type = "email"
                    const email = input.value
                    if (email && ev.currentTarget.checkValidity()) {
                        input.disabled = true
                        if (timeout) clearTimeout(timeout)
                        timeout = setTimeout(() => {
                            input.value = ""
                            alert(
                                "You'll get a notification as soon as the site is ready. Thanks you",
                            )
                        }, 3000)
                    } else {
                        input.value = ""
                        alert("Invalid Form")
                    }
                }}
                className="mt-2 max-w-[600px] mx-auto px-2 sm:px-0"
            >
                <h2 className="text-center pb-1 pt-4 text-xl tracking-wide font-bold">
                    Get Notified
                </h2>
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email Address"
                    className="bg-slate-700 rounded-md w-full p-2 border-slate-500 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                />
                <p className="pt-2 text-center text-sm text-gray-500">
                    By filling out this form, you agree to receive emails from
                    us about Chatvite.
                </p>

                {user && (
                    <button className="mt-4 text-sky-500">
                        Use my email instead
                    </button>
                )}
            </form>
        </div>
    )
}
