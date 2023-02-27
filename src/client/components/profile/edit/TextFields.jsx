import React, { useLayoutEffect, useState, useRef, useEffect } from "react"

export default function TextFields({ account: data }) {
    const [account, updateAccount] = useState(data)
    const containerRef = useRef()
    const saveBtnRef = useRef()
    const formRef = useRef()

    useEffect(() => {
        if (containerRef.current) {
            const saveBtn = containerRef.current
                .closest("#editAccount")
                .querySelector("[data-save-account]")
            const form = containerRef.current
                .closest("#editAccount")
                .querySelector("form")

            saveBtnRef.current = saveBtn
            formRef.current = form
        }
    }, [])

    function handleFieldChange(ev) {
        const name = ev.target.name
        updateAccount((prev) => ({ ...prev, [name]: ev.target.value }))

        saveBtnRef.current.disabled = !formRef.current.checkValidity()
    }

    return (
        <div ref={containerRef}>
            <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="flex items-center">
                    <span className="text-lg font-semibold">Name</span>
                </label>
                <input
                    pattern=".{5,30}"
                    onChange={handleFieldChange}
                    type="text"
                    name="name"
                    value={account.name}
                    required
                    autoComplete="off"
                    spellCheck="false"
                    className="bg-gray-800 rounded-md p-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    placeholder="full name"
                />
            </div>
            <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="flex items-center">
                    <span className="text-lg font-semibold">Username</span>
                </label>
                <input
                    pattern=".{5,30}"
                    onChange={handleFieldChange}
                    type="text"
                    name="username"
                    value={account.username}
                    required
                    autoComplete="off"
                    spellCheck="false"
                    className="bg-gray-800 rounded-md p-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    placeholder="your username"
                />
                <p className="text-sm tracking-wide truncate px-1 text-orange-400 leading-4">
                    Changing your username might cause unintended side effects.
                </p>
            </div>
            <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="flex items-center">
                    <span className="text-lg font-semibold">Email Address</span>
                </label>
                <input
                    onChange={handleFieldChange}
                    type="email"
                    name="email"
                    value={account.email}
                    required
                    autoComplete="off"
                    spellCheck="false"
                    className="bg-gray-800 rounded-md p-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    placeholder="email address"
                />
                <p className="text-sm tracking-wide truncate px-1 text-orange-400 leading-4">
                    Note: you&apos;ll have to verify your email after changing
                    it.
                </p>
            </div>
        </div>
    )
}
