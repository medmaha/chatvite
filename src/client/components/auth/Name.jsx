import React, { useContext, useEffect, useRef, useState } from "react"
import Link from "next/link"
import axios from "axios"

import { useRouter } from "next/router"
import { GlobalContext } from "../../contexts"
import { getSession } from "next-auth/react"
import Pending from "../UI/Pending"
import Meta from "../../contexts/Meta"

export default function Name() {
    const formRef = useRef()
    const router = useRouter()
    const [pending, setPending] = useState(false)
    const { setUser, user } = useContext(GlobalContext)

    useEffect(() => {
        // authenticated/verify the user token
        const { token } = getProfileIdFromUrl(window.location.href)
        console.log(token)
    }, [])

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

                setUser({ ...user, ...data, active: user?.active })
                await router.replace("/feed")
            })
            .catch((err) => {
                console.error(err.message)
            })
            .finally(() => {
                setPending(false)
            })
    }

    return (
        <>
            <Meta>
                <title>ChatVite | Add Your Name</title>
            </Meta>
            {!user?.name ? (
                <div className="flex flex-col items-center justify-center mt-[50px]">
                    <div className="w-full relative overflow-hidden max-w-[450px] bg-gray-700 p-4 px-8 rounded-2xl flex flex-col items-center">
                        {pending && (
                            <div className="absolute z-10 top-0 w-full left-0 h-full bg-black bg-opacity-50 flex justify-center items-start">
                                <Pending h="100%" />
                            </div>
                        )}
                        <h2 className="font-bold text-xl tracking-wide text-center pb-1">
                            You&apos;re almost done!
                        </h2>
                        <p className="text-center max-w-[42ch] text-sm text-gray-300 font-semibold tracking-wide pb-2 py-2">
                            Help friends and colleagues find you easily by
                            providing your{" "}
                            <span className="text-sky-400 font-bold">name</span>
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
                            By clicking continue, you agree to our privacy
                            policy.
                        </p>
                        <button className="text-blue-400 hover:text-blue-500 font-bold rounded">
                            Privacy Policy
                        </button>
                    </div>
                </div>
            ) : (
                user && (
                    <div className="flex justify-center mt-[150px]">
                        <p className="text-center text-2xl tracking-wider max-w-[35ch] animate-pulse">
                            Signing you in{" "}
                            <span className="animate-ping">...</span>
                        </p>
                    </div>
                )
            )}
        </>
    )
}

function getProfileIdFromUrl(url = "") {
    const query = {}
    try {
        const queryParams = url.split("?")[1]
        if (queryParams) {
            const params = queryParams.split("&")
            for (const _query of params) {
                const [key, value] = _query.split("=")

                if (key && value) {
                    query[key] = value
                }
            }
        }
        return query
    } catch (error) {
        return query
    }
}
