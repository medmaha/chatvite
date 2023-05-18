import React, { useEffect, useRef } from "react"
import Chat from "./Chat"

export default function ChatCollections({ fuses }) {
    const lastElemRef = useRef()
    // useEffect(() => {
    //     if (fuses?.length > 5)
    //         lastElemRef.current.scrollIntoView({
    //             behavior: "smooth",
    //         })
    // }, [fuses])
    return (
        <div data-chat-collections className="overflow-hidden overflow-y-auto">
            {fuses && (
                <>
                    {fuses?.map((fuse) => {
                        return (
                            <span
                                key={fuse._id}
                                data-fuse-chat
                                className="fusechat"
                            >
                                <Chat fuse={fuse} />
                            </span>
                        )
                    })}
                </>
            )}
            {fuses?.length > 2 && (
                <div
                    ref={lastElemRef}
                    data-last-target
                    className="pt-1 w-full"
                ></div>
            )}
        </div>
    )
}
