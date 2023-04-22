import React, { useRef, useState, useEffect } from "react"

import axios from "axios"

export default function Username({ errorMsg }) {
    const [suggestions, updateSuggestions] = useState([])
    const [suggest, toggleSuggest] = useState(false)

    const [render, reRerender] = useState(0)

    const formRef = useRef()
    const usernameRef = useRef()

    useEffect(() => {
        formRef.current = usernameRef.current.closest("form")

        if (!errorMsg) {
            colorBorders("r")
        }
    }, [errorMsg])

    function generateUsernameSuggestion() {
        const suggestions = []
        // const sanitizedInput = usernameRef.current.value.replace(/[^a-zA-Z0-9]/g, "-")
        const sanitized = usernameRef.current.value.replace(
            /[^a-zA-Z0-9]/g,
            "-",
        )

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

            // if (data === usernameRef.current.value) {
            //     if (data === usernameRef.current.value) {
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

        if (
            sanitized.split("-").length > 1 &&
            l !== usernameRef.current.value
        ) {
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
                        data: [suggestions, usernameRef.current.value],
                    })
                    .then((res) => {
                        const data = [...suggestions]
                        for (const existName of res.data) {
                            data.filter(
                                (s) =>
                                    s !== existName &&
                                    s !== usernameRef.current.value,
                            )
                        }
                        resolve(data)
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

    async function getSuggestions() {
        if (usernameRef.current.value.length > 2) {
            const suggestions = await generateUsernameSuggestion(
                usernameRef.current.value,
            )
            updateSuggestions(suggestions)
        } else {
            updateSuggestions([])
            toggleSuggest(false)
        }
    }

    const handleInputChange = debounce(async (ev) => {
        reRerender(render + 1)
        if (usernameRef.current.value.match(/[^a-zA-Z0-9\-_]/)) {
            const input = usernameRef.current
            colorBorders("a")
            input.focus()
        }
        if (!suggest) return
        getSuggestions()
    }, 500)

    function colorBorders(action) {
        const inputElement = usernameRef.current
        switch (action) {
            case "a":
                inputElement.classList.remove(
                    "focus:border-sky-500",
                    "border-gray-700",
                )
                inputElement.classList.add(
                    "focus:border-red-400",
                    "border-red-400",
                )
            case "r":
                inputElement.classList.remove(
                    "focus:border-red-400",
                    "border-red-400",
                )
                inputElement.classList.add(
                    "focus:border-sky-500",
                    "border-gray-700",
                )
                break
            default:
                break
        }
    }

    return (
        <div className="flex flex-col mb-3 w-full">
            <label
                className="flex items-center w-full justify-between"
                htmlFor="username"
            >
                <span className="text-lg px-1 font-semibold leading-none">
                    Username
                </span>
                <span
                    className={`text-${
                        errorMsg ? "red" : "orange"
                    }-400 text-xs truncate px-2`}
                >
                    {errorMsg || "No spaces or special characters in username"}
                </span>
            </label>
            <input
                ref={usernameRef}
                type="text"
                placeholder="my-username"
                name="username"
                id="username"
                required
                onBlur={() => toggleSuggest(false)}
                onChange={handleInputChange}
                className="bg-gray-800 rounded-lg px-2 py-3 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                onKeyDown={(ev) => {
                    if (ev.key.match(/[^a-zA-Z0-9\-_]/)) ev.preventDefault()
                }}
            />
            {suggest && (
                <div className="text-sky-500 text-xs flex-1 inline-flex justify-around gap-[1px] ml-2 py-1">
                    {suggestions.map((s) => {
                        return (
                            <button
                                onClick={() => {
                                    const inputElement = usernameRef.current
                                    inputElement.value = s
                                    colorBorders("r")
                                    inputElement.blur()
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
                    type="button"
                    onClick={() => {
                        toggleSuggest(true)
                        getSuggestions()
                    }}
                    className="text-sm text-blue-400 hover:text-blue-500"
                >
                    {usernameRef.current?.value.length > 2 && (
                        <>{suggest ? "suggest again?" : "suggest username?"}</>
                    )}
                </button>
            </div>
        </div>
    )
}
