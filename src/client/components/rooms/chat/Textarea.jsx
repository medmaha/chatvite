import { useSession } from "next-auth/react"
import React, { useEffect, useLayoutEffect, useRef } from "react"

import { useRouter } from "next/router"

export default function Textarea({ onSubmit }) {
    const session = useSession()
    const router = useRouter()
    const weChatRef = useRef()

    function handleWeChat(ev) {
        ev.preventDefault()

        if (!session.data?.user) {
            router.push("/auth/login")
            return
        }

        const content = ev.target.wechat.value

        function cb() {
            ev.target.wechat.value = ""
            ev.target.wechat.blur()
        }

        onSubmit(content, cb)
    }

    useEffect(() => {
        weChatRef.current.focus()
    }, [])

    return (
        <form className="w-full h-full block" onSubmit={handleWeChat}>
            <div className="h-full bg-gray-800 w-full flex px-4 items-center">
                <input
                    ref={weChatRef}
                    type="text"
                    name="wechat"
                    placeholder="wechat! write here..."
                    required
                    className="bg-gray-800 w-full rounded-md p-2 border-gray-700 transition-[border-color] border-solid focus:outline-none border-[2px] focus:border-sky-500"
                />
            </div>
        </form>
    )
}
