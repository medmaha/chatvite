import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import Modal from "../UI/layouts/Modal"
import TextFields from "./edit/TextFields"
import PasswordFields from "./edit/PasswordFields"

export default function EditProfile({ account, toggleEdit }) {
    const [formData, updateFormData] = useState({})

    const accountEditRef = useRef()
    const formRef = useRef()
    const saveBtnRef = useRef()
    // const accountEditRef = useRef()

    useLayoutEffect(() => {
        const form = accountEditRef.current.querySelector(
            "#accountEditModal form",
        )

        const saveBtn = accountEditRef.current.querySelector(
            "button[data-save-account]",
        )

        formRef.current = form
        saveBtnRef.current = saveBtn

        form.addEventListener("input", (ev) => {
            console.log(ev.target.type)
            if (ev.target.type === "password") handlePasswordsValidation(ev)
            else handleTextFieldsValidation(ev)
        })
    }, [])

    function handleModalClose() {
        toggleEdit(false)
    }

    function handleTextFieldsValidation(ev) {
        saveBtnRef.current.disabled = !formRef.current.checkValidity()
    }

    function handlePasswordsValidation(ev) {
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

    function handleFormSave(ev) {
        if (!formRef.current?.checkValidity()) {
            ev.currentTarget.setCustomValidity("invalid form")
            handleTextFieldsValidation("add", "input[required]")
            return
        } else {
            alert("An error occurred")
        }
    }

    return (
        <div ref={accountEditRef} className="">
            <Modal
                title={"Profile Account"}
                onClose={handleModalClose}
                content={<Form account={account} />}
                actionBtn={
                    <button
                        data-save-account
                        disabled
                        onClick={handleFormSave}
                        className="disabled:bg-gray-500 disabled:opacity-25 px-3 rounded-lg py-1 transition bg-blue-400 hover:bg-blue-500"
                    >
                        Save Changes
                    </button>
                }
            />
        </div>
    )
}

function Form({ account }) {
    const formRef = useRef()

    return (
        <div data-account-edit id="accountEditModal">
            <Avatar uri="/images/avatar.png" />
            <form ref={formRef} action="">
                <TextFields />
                <p className="text-lg font-bold py-2 text-center tracking-wide">
                    Change Password
                </p>
                <PasswordFields />
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

function Avatar({ uri, updateForm }) {
    const [src, setSrc] = useState(uri)

    const avatarRef = useRef()
    const fileInputRef = useRef()

    useEffect(() => {
        const inputElement = fileInputRef.current
        inputElement.addEventListener("change", handleAvatarChange)
        return () =>
            inputElement.removeEventListener("change", handleAvatarChange)
    }, [])

    function handleAvatarChange(ev) {
        const file = ev.target.files[0]
        if (file) {
            const srcUrl = URL.createObjectURL(file)
            setSrc(srcUrl)
        }
    }

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden pointer-events-none"
            />
            <div className="relative flex flex-col items-center">
                <div className="w-[65px] h-[65px]">
                    <Image
                        ref={avatarRef}
                        alt="user profile avatar"
                        width={65}
                        height={65}
                        src={src}
                        // fill={true}
                        style={{ objectFit: "cover", height: "65px" }}
                        className="rounded-full"
                    />
                </div>
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="text-sm px-2 inline-flex gap-1 items-center transition text-blue-400 hover:text-blue-500"
                >
                    <span>change</span>
                    <span>
                        <svg
                            fill="currentColor"
                            width="1em"
                            height=".9em"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                        </svg>
                    </span>
                </button>
                <div className="absolute top-[50%] right-[50%]"></div>
            </div>
        </>
    )
}
