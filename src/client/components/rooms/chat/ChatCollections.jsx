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
                <div data-last-target className="pt-1 w-full"></div>
            )}
        </div>
    )
}
