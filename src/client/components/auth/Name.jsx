import React, { useContext, useEffect, useRef, useState } from "react"
import Link from "next/link"
import axios from "axios"

import { useRouter } from "next/router"
import { GlobalContext } from "../../contexts"
import { getSession } from "next-auth/react"

export default function Name() {
    const formRef = useRef()
    const router = useRouter()
    const [pending, setPending] = useState(false)
    const { setUser } = useContext(GlobalContext)

    useEffect(() => {}, [])

    function submitForm(ev) {
        ev.preventDefault()
        setPending(true)

        const name = ev.currentTarget.name

        axios
            .put(
                "/api/profile/update",
                { name: name?.value },
                { withCredentials: true },
            )
            .then(async (res) => {
                const data = res.data

                await axios.get("/api/auth/session?update=1")
                name.value = ""

                const { user } = await getSession()

                setUser({ ...data, active: user?.active })
                router.replace("/feed")
            })
            .catch((err) => {
                console.error(err.message)
            })
            .finally(() => {
                setPending(false)
            })
    }

    return (
        <div className="flex flex-col items-center justify-center mt-[50px]">
            <div className="w-full relative max-w-[450px] bg-gray-700 p-4 px-8 rounded-2xl flex flex-col items-center">
                {pending && (
                    <div className="absolute top-0 left-0 w-full h-full z-20 cursor-wait"></div>
                )}
                <h2 className="font-bold text-xl tracking-wide text-center pb-1">
                    You&apos;re almost done!
                </h2>
                <p className="text-center max-w-[42ch] text-sm text-gray-300 font-semibold tracking-wide pb-2 py-2">
                    Help friends and colleagues find you easily by providing
                    your <span className="text-sky-400 font-bold">name</span>
                </p>

                <form
                    ref={formRef}
                    method="post"
                    className="w-full z-0"
                    onSubmit={submitForm}
                >
                    <div className="flex flex-col mb-3">
                        <label htmlFor="flex items-center">
                            <span className="text-lg px-1 font-semibold leading-none">
                                Name
                            </span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="your full name"
                            className="bg-gray-800 rounded-lg px-2 py-3 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                        />
                    </div>

                    <div className="flex justify-between gap-4 py-2">
                        <button
                            onClick={() => {
                                router.replace("/feed")
                            }}
                            type="button"
                            className="py-2 w-full transition hover:text-gray-200 hover:border-opacity-25 hover:bg-gray-500 text-gray-400 border-gray-400 border rounded-md text-lg md:text-xl font-semibold tracking-wide"
                        >
                            Later
                        </button>
                        <button
                            type="submit"
                            className="py-2 w-full transition hover:text-gray-200 hover:border-opacity-25 hover:bg-sky-500 text-sky-400 border-sky-400 border rounded-md text-lg md:text-xl font-semibold tracking-wide"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-5 pt-4 flex flex-col items-center">
                <p className="text-sm text-gray-400 mt-1">
                    By clicking continue, you agree to our privacy policy.
                </p>
                <button className="text-blue-400 hover:text-blue-500 font-bold rounded">
                    Privacy Policy
                </button>
            </div>
        </div>
    )
}
