import React, { useLayoutEffect, useState, useRef, useEffect } from "react"

export default function PasswordFields({ account: data }) {
    const [account, updateAccount] = useState({})
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

            // updateAccount(data)
        }
    }, [])

    function handleFieldChange(ev) {
        const name = ev.target.name
        updateAccount((prev) => ({ ...prev, [name]: ev.target.value }))

        const inputField = formRef.current.querySelectorAll(
            `input[type="password"]`,
        )

        if (ev.target.value.length > 0) {
            for (const input of inputField) {
                input.required = true
            }
        } else {
            const queue = []
            let value
            for (const input of inputField) {
                if (input.value.length > 0) {
                    input.required = true
                    value = true
                } else {
                    queue.push(input)
                }
            }
            if (!value) {
                for (const input of queue) {
                    input.required = false
                }
            }
        }

        saveBtnRef.current.disabled = !formRef.current.checkValidity()
    }

    return (
        <div ref={containerRef}>
            <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="flex items-center">
                    <span className="text-sm font-semibold">
                        Current Password
                    </span>
                </label>
                <input
                    onChange={handleFieldChange}
                    type="password"
                    name="current-password"
                    className="bg-gray-800 rounded-md p-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    placeholder="current password"
                />
            </div>
            <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="flex items-center">
                    <span className="text-sm font-semibold">New Password</span>
                </label>
                <input
                    onChange={handleFieldChange}
                    type="password"
                    name="new-password"
                    className="bg-gray-800 rounded-md p-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    placeholder="new password"
                />
            </div>
            <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="flex items-center">
                    <span className="text-sm font-semibold">
                        Confirm Password
                    </span>
                </label>
                <input
                    onChange={handleFieldChange}
                    type="password"
                    name="confirm-password"
                    className="bg-gray-800 rounded-md p-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                    placeholder="confirm password"
                />
            </div>
        </div>
    )
}
