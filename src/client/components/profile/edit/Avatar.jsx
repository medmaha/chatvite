import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { getUserAvatarUrl } from "../../../../utils"

export default function Avatar({ uri, updateForm }) {
    const [src, setSrc] = useState("")
    const saveBtnRef = useRef()

    useEffect(() => {
        const saveBtn = document.querySelector(
            "#editAccount [data-save-account]",
        )
        saveBtnRef.current = saveBtn
        if (uri) {
            setSrc(getUserAvatarUrl(uri))
        }
    }, [uri])

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
            createAvatarDataUrl(file)
        }
    }

    function createAvatarDataUrl(file) {
        const reader = new FileReader()
        reader.onload = () => {
            const data = reader.result
            resizeImage(data, file.type)
        }
        reader.readAsDataURL(file)
        const formElement =
            avatarRef.current.parentElement.querySelector("form")
        saveBtnRef.current.disabled = !formElement.checkValidity()
    }

    async function resizeImage(url, fileType) {
        const MAX_WIDTH = 120

        const canvas = document.createElement("canvas")
        const img = document.createElement("img")
        const ctx = canvas.getContext("2d")

        img.onload = () => {
            if (img.naturalWidth > MAX_WIDTH) {
                const aspectRatio = img.width / img.height
                img.width = MAX_WIDTH
                img.height = img.height * aspectRatio
            }

            canvas.width = 150
            canvas.height = 150

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            const imgUrl = canvas.toDataURL(fileType, 0.9)
            setSrc(imgUrl)
            localStorage.setItem("avatar", imgUrl)
            localStorage.setItem("avatar-edt", true)

            Promise.resolve()
        }
        img.src = url
    }

    return (
        <div data-avatar-wrapper ref={avatarRef}>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden pointer-events-none"
            />
            <div className="relative flex flex-col items-center">
                <div className="w-[65px] h-[65px]">
                    {src.length && (
                        <Image
                            data-avatar-img
                            alt="user profile avatar"
                            width={65}
                            height={65}
                            src={src}
                            // fill={true}
                            style={{ objectFit: "cover", height: "65px" }}
                            className="rounded-full"
                        />
                    )}
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
            </div>
        </div>
    )
}
