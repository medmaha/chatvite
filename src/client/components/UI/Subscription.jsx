import React, { useContext, useState, useRef } from "react"
import { GlobalContext } from "../../contexts"
import axios from "axios"

let timeout

export default function Subscription() {
    const { user, newAlertEmit } = useContext(GlobalContext)
    const [pending, togglePending] = useState(false)
    const [invalid, toggleInvalid] = useState(true)

    const input = useRef()
    const form = useRef()

    function handleSubmit(ev) {
        ev.preventDefault()
        input.current.type = "email"
        input.current.required = true

        const validEmail = form.current.checkValidity()
        toggleInvalid(!validEmail)

        if (validEmail) {
            const email = input.current.value
            sendSubscription(email)
        }
    }

    function handleEmailChange(ev) {
        const validEmail = form.current.checkValidity()
        if (validEmail) return toggleInvalid(false)
        toggleInvalid(true)
    }

    function useMyEmail(ev) {
        ev.preventDefault()
    }

    async function sendSubscription(email) {
        togglePending(true)
        try {
            const { data } = await axios.post("/api/subscriptions", { email })
            input.current.value = ""
            newAlertEmit({
                text: data.message,
                success: true,
            })
        } catch (error) {
            let errMsg = error.response?.data?.message

            if (!errMsg) errMsg = error.message

            console.error(errMsg)
            newAlertEmit({
                text: errMsg,
                invalid: true,
            })
        } finally {
            togglePending(false)
        }
    }

    return (
        <form
            ref={form}
            onSubmit={handleSubmit}
            className="mt-2 max-w-[600px] mx-auto px-2 sm:px-0 text-center"
        >
            <h2 className="text-center pb-4 pt-4 text-xl tracking-wide font-bold">
                Get notified
            </h2>
            <div className="flex w-full gap-1">
                <input
                    ref={input}
                    type="email"
                    name="email"
                    required
                    onChange={handleEmailChange}
                    disabled={pending}
                    placeholder="Email Address"
                    className="bg-slate-700 disabled:bg-opacity-20 disabled:border-opacity-20 disabled:text-opacity-10 disabled:pointer-events-none
                     rounded-md w-full p-2 border-slate-500 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-600"
                />
                <button
                    disabled={invalid || pending}
                    className="bg-sky-600 rounded-lg px-4 font-semibold disabled:text-gray-500 disabled:bg-opacity-20 disabled:pointer-events-none"
                >
                    Submit
                </button>
            </div>
            <p className="pt-2 text-center text-sm text-gray-500">
                By filling out this form, you agree to receive emails from us
                about Chatvite.
            </p>

            {user && (
                <button
                    type="button"
                    disabled={pending}
                    onClick={useMyEmail}
                    className="mt-4 text-sky-500 disabled:text-opacity-50"
                >
                    Use my email instead
                </button>
            )}
        </form>
    )
}
