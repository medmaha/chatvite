import { Loader2 } from "lucide-react"

import React, { useState } from "react"

export default function SubscribeButton(props) {
    const [loading, toggleLoading] = useState(false)
    const { isMember, joinChatRoom } = props

    const submit = async () => {
        if (loading) return
        toggleLoading(true)
        await joinChatRoom()
        toggleLoading(false)
    }

    return (
        <div className="md:mr-4 transition">
            {isMember && (
                <button
                    disabled={loading}
                    onClick={submit}
                    className="py-1 px-2 inline-flex gap-1 items-center hover:bg-red-500 transition bg-red-400 text-sm sm:text-base sm:font-semibold rounded-2xl"
                >
                    <span className="capitalize">Unsubscribe</span>
                    {loading && (
                        <Loader2 className="md:w-4 md:h-4 w-3 h-3 animate-spin" />
                    )}
                </button>
            )}
            {isMember === false && (
                <button
                    disabled={loading}
                    onClick={submit}
                    className="py-1  px-2 inline-flex gap-1 items-center hover:bg-blue-500 transition bg-blue-400 text-sm sm:text-base sm:font-semibold rounded-2xl"
                >
                    {!loading && <span className="leading-none">+</span>}
                    <span className="capitalize">Subscribe</span>
                    {loading && (
                        <Loader2 className="md:w-4 md:h-4 w-3 h-3 animate-spin" />
                    )}
                </button>
            )}
        </div>
    )
}
