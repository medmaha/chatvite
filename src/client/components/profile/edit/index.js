import React, { useLayoutEffect, useRef, useState } from "react"
import Modal from "../../UI/layouts/Modal"
import Form from "./Form"

export default function EditProfile({ account, toggleEdit, submitForm }) {
    const accountEditRef = useRef()
    const formRef = useRef()
    const saveBtnRef = useRef()
    const submitBtnRef = useRef()

    const [closeModal, setCloseModal] = useState(false)
    const [pending, setPending] = useState(false)

    useLayoutEffect(() => {
        const form = accountEditRef.current.querySelector(
            "#accountEditModal form",
        )

        const saveBtn = accountEditRef.current.querySelector(
            "button[data-save-account]",
        )
        const submitBtn = form.querySelector("button[data-submit-form]")

        formRef.current = form
        saveBtnRef.current = saveBtn
        submitBtnRef.current = submitBtn

        saveBtn.addEventListener("click", handleFormSave)
    }, [])

    function handleModalClose() {
        toggleEdit(false)
    }

    function handleFormSave(ev) {
        ev.preventDefault()
        const form = formRef.current
        submitBtnRef.current.click()
        if (form.checkValidity()) {
        }
    }

    function validateClient(data = {}, ev) {
        let setsPassword = false

        const invalidFields = []

        for (const [key, value] of Object.entries(data)) {
            if (key.match(/password/g) && !!value.length) {
                setsPassword = true
                continue
            }

            if (["username", "email", "name"].includes(key)) {
                if (value.length < 5) invalidFields.push(key)
                continue
            }
        }

        if (setsPassword) {
        }
        for (const field of invalidFields) {
            const element = ev.target[field]
            element.classList.add("invalid:border-red-400")
            element.setCustomValidity(
                `the "${field}" field is required with 5 characters long`,
            )
            formRef.current.reportValidity()
        }

        if (setsPassword) {
            const passwords = ev.target.querySelectorAll(
                'input[type="password"]',
            )
            passwords.forEach((element) => {
                const valueLength = element.value.length

                if (!!valueLength && valueLength >= 5) return

                if (!!valueLength && valueLength < 5) {
                    element.setCustomValidity(
                        "password must be at least 5 characters long",
                    )
                } else {
                    element.setCustomValidity("this field required")
                }
                element.classList.add("invalid:border-red-400")
            })
            formRef.current.reportValidity()
        }

        const avatarContainer = accountEditRef.current.querySelector(
            "[data-avatar-wrapper]",
        )
        const avatarImg = avatarContainer.querySelector("[data-avatar-img]")

        const cb = (error) => {
            if (!error) {
                setCloseModal(true)
                return
            }
            alert("An error occurred")
        }
        setPending(true)
        submitForm(data, cb)
    }

    return (
        <div ref={accountEditRef} id="editAccount">
            <Modal
                pending={pending}
                pendingText="Saving"
                title={"Profile Account"}
                close={closeModal}
                onClose={handleModalClose}
                content={<Form onSubmit={validateClient} account={account} />}
                actionBtn={
                    <button
                        data-save-account
                        disabled
                        className="disabled:bg-gray-500 disabled:opacity-25 px-3 rounded-lg py-1 transition bg-blue-400 hover:bg-blue-500"
                    >
                        Save Changes
                    </button>
                }
            />
        </div>
    )
}
