import React from "react"
import Chat from "./Chat"

export default function ChatCollections({ fuses }) {
    return (
        <div data-fuse-collections>
            {fuses && (
                <>
                    {fuses?.map((fuse) => {
                        return (
                            <span
                                data-fuse-chat
                                key={fuse.id}
                                className="fusechat"
                            >
                                <Chat fuse={fuse} />
                            </span>
                        )
                    })}
                </>
            )}
            <div data-last-target className="py-2 w-full"></div>
        </div>
    )
}
