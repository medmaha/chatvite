import React, { useRef, useState } from "react"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import axios from "axios"
import { useRouter } from "next/router"

export default function Signup({ csrfToken }) {
    const formRef = useRef()
    const router = useRouter()

    const [suggestions, updateSuggestions] = useState([])
    const [suggest, toggleSuggest] = useState(false)

    function submitForm(ev) {
        ev.preventDefault()

        const data = new FormData(ev.target)

        axios
            .post("/api/authenticate/signup", data, {
                headers: { "content-type": "application/json" },
                withCredentials: true,
            })
            .then(async (res) => {
                console.log(res.data)

                const login = await signIn("credentials", {
                    csrfToken,
                    email: data.get("email"),
                    "current-password": data.get("password"),
                    redirect: false,
                })

                console.log(res.data)

                if (login.ok) {
                    router.replace("/auth/verify")
                }
                if (login.error) {
                    alert(login.error)
                }
            })
            .catch((err) => {
                if (err.response) {
                    console.error(err.response.data.message)
                }
                console.error(err.message)
            })
    }

    function generateUsernameSuggestion(input) {
        const suggestions = []
        // const sanitizedInput = input.replace(/[^a-zA-Z0-9]/g, "-")
        const sanitized = input.replace(/[^a-zA-Z0-9]/g, "-")

        function sanitizedInput() {
            const [fn, mn, ln] = sanitized.split("-")

            let s1,
                s2,
                s3,
                s4,
                s5 = ""

            s1 = fn

            if (mn) {
                s1 = fn + "-" + mn
                s2 = fn + mn
                s3 = mn + "-" + fn
                s4 = mn + fn
            }

            if (ln) {
                s1 = fn + "-" + ln
                s2 = fn + "-" + mn + ln
                s3 = ln + "-" + mn + fn
                s4 = mn + "-" + ln + fn
                s4 = mn + ln + fn
            }

            const sugs = [s1, s2, s3, s4, s5].filter((s) => !!s?.length)
            let data = sugs[Math.floor(Math.random() * sugs.length)]

            // if (data === input) {
            //     if (data === input) {
            //         data = ""
            //     }
            // }
            return data
        }

        const suffix = (n = 1000) => {
            return Math.floor(Math.random() * n)
        }
        suggestions.push(`${sanitizedInput()}-${suffix()}`)
        suggestions.push(`${suffix()}-${sanitizedInput()}`)
        let l = sanitizedInput()
        if (sanitized.split("-").length > 1 && l !== input) {
            suggestions.push(`${sanitizedInput()}`)
        } else {
            suggestions.push(`${suffix(100)}-${sanitizedInput()}-${suffix(99)}`)
        }
        // suggestions.push(`${sanitizedInput()}-${suffix()}`)
        // suggestions.push(`${suffix()}-${sanitizedInput()}`)

        return new Promise((resolve, reject) => {
            function filterFromDatabase() {
                axios
                    .post("/api/profile/user/filter?username=1", {
                        data: [suggestions, input],
                    })
                    .then((res) => {
                        const data = [...suggestions]
                        for (const existName of res.data) {
                            data.filter((s) => s !== existName && s !== input)
                        }
                        resolve([data, res.data])
                    })
                    .catch((err) => {
                        console.error(err.response?.data.message || err.message)
                        reject(err)
                    })
            }
            filterFromDatabase()
        })
    }
    function debounce(fn, delay) {
        let timeoutId
        return function (...args) {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => fn.apply(this, args), delay)
        }
    }

    const handleInputChange = debounce(async (ev) => {
        if (!suggest) return
        const input = ev.target.value
        if (input.length > 2) {
            const [suggestions, response] = await generateUsernameSuggestion(
                ev.target.value,
            )
            if (response.includes(input)) {
                console.log(response)
                ev.target.classList.remove(
                    "border-blue-400",
                    "focus:border-blue-400",
                )
                ev.target.classList.add(
                    "focus:border-red-400",
                    "border-red-400",
                )
            } else {
                ev.target.classList.remove(
                    "border-red-400",
                    "focus:border-red-400",
                )
                ev.target.classList.add("focus:border-blue-400")
            }
            updateSuggestions(suggestions)
        } else {
            updateSuggestions([])
        }
    }, 500)

    return (
        <div className="flex justify-center mt-4">
            <div className="w-full max-w-[450px] bg-gray-700 p-4 px-8 rounded-2xl">
                <h2 className="font-bold text-2xl tracking-wide text-center pb-1">
                    Chat Vite
                </h2>
                <p className="text-center text-sm text-gray-300 font-semibold tracking-wide pb-2">
                    Explore your chat experience
                </p>
                <form ref={formRef} method="post" onSubmit={submitForm}>
                    <input
                        name="csrfToken"
                        type="hidden"
                        defaultValue={csrfToken}
                    />
                    <div className="flex flex-col mb-3">
                        <label
                            htmlFor="email"
                            className="flex items-center inline-flex items-center"
                        >
                            <span className="text-lg px-1 font-semibold leading-none">
                                Email
                            </span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="example@abc.com"
                            required
                            className="bg-gray-800 rounded-lg px-2 py-3 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                        />
                    </div>
                    <div className="flex flex-col mb-3 w-full">
                        <label
                            className="flex items-center w-full"
                            htmlFor="username"
                        >
                            <span className="text-lg px-1 font-semibold leading-none">
                                Username
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder="my-username"
                            name="username"
                            id="username"
                            required
                            onChange={handleInputChange}
                            className="bg-gray-800 rounded-lg px-2 py-3 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                        />
                        {suggest && (
                            <div className="text-sky-500 text-xs flex-1 inline-flex justify-around gap-[1px] ml-2 py-1">
                                {suggestions.map((s) => {
                                    return (
                                        <button
                                            onClick={() => {
                                                const inputElement =
                                                    formRef.current.querySelector(
                                                        'input[name="username"]',
                                                    )
                                                inputElement.value = s
                                                inputElement.classList.replace(
                                                    "focus:border-red-400",
                                                    "focus:border-blue-400",
                                                )
                                                inputElement.classList.replace(
                                                    "border-red-400",
                                                    "border-blue-400",
                                                )
                                                inputElement.focus()
                                            }}
                                            type="button"
                                            key={s}
                                            className=""
                                        >
                                            {s}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={() => toggleSuggest((prev) => !prev)}
                                className="text-sm text-blue-400 hover:text-blue-500"
                            >
                                suggest username?
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col mb-3">
                        <label htmlFor="password" className="flex items-center">
                            <span className="text-lg px-1 font-semibold leading-none">
                                Password
                            </span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="xxxxxxxxxxxx"
                            required
                            className="bg-gray-800 rounded-lg px-2 py-3 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                        />
                    </div>

                    <div className="flex justify-end py-2">
                        <button className="py-2 w-full transition hover:text-gray-200 hover:border-opacity-25 hover:bg-sky-500 text-sky-400 border-sky-400 border rounded-md text-lg md:text-xl font-semibold tracking-wide">
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className="text-center mt-1">
                    <div className="mt-1">
                        <p className="text-gray-300 mt-4">
                            Already have an account?{" "}
                            <Link
                                href={"/auth/login"}
                                className="text-sky-400 font-semibold p-1 border-b border-solid border-current"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
