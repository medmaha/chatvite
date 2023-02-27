import React, { useRef, useEffect } from "react"

import Avatar from "./Avatar"
import TextFields from "./TextFields"
import PasswordFields from "./PasswordFields"

export default function Form({ account, onSubmit }) {
    const formRef = useRef()
    const saveBtnRef = useRef()

    useEffect(() => {
        const saveBtn = document.querySelector(
            "#editAccount [data-save-account]",
        )
        saveBtnRef.current = saveBtn
    }, [])

    function change(ev) {
        ev.target.classList.remove("invalid:border-red-400")
        saveBtnRef.current.disabled = !formRef.current.checkValidity()

        ev.currentTarget.querySelectorAll("input").forEach((input) => {
            input.setCustomValidity("")
        })
    }

    function submit(ev) {
        ev.preventDefault()
        const form = new FormData(formRef.current)

        const data = [...form.keys()].reduce((data, key) => {
            const value = form.get(key)

            if (value.length > 0) {
                data[key] = value
            }
            return data
        }, {})
        onSubmit(data, ev)
    }

    return (
        <div data-account-edit id="accountEditModal">
            <Avatar uri={account.avatar} />
            <form onInput={change} onSubmit={submit} ref={formRef} action="">
                <TextFields account={account} />
                <p className="text-lg font-bold py-2 text-center tracking-wide">
                    Change Password
                </p>
                <PasswordFields />

                <button
                    data-submit-form
                    type="submit"
                    className="hidden pointer-events-none"
                ></button>
            </form>
            <div className="px-4 pb-4">
                <p className="text-xl text-center pt-4 pb-2 font-bold tracking-wide text-red-400">
                    Danger Zone
                </p>
                <button className="w-full bg-red-400 font-semibold text-gray-300 text-lg hover:bg-red-500 py-2 text-center rounded-md my-4">
                    Delete Account
                </button>
            </div>
        </div>
    )
}
