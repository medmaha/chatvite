import React, { useRef, useLayoutEffect } from "react"
import Member from "./Member"

export default function MemberCollections({ hostId, members }) {
    const membersContainerRef = useRef()

    useLayoutEffect(() => {
        const container = membersContainerRef.current
        const screenHeight = window.innerHeight
        const position = container.getBoundingClientRect().y

        const height = screenHeight - position
        const offset = 10

        container.style.maxHeight = `${height - offset}px`
    }, [])
    return (
        <div
            ref={membersContainerRef}
            className="p-[.5em] overflow-hidden overflow-y-auto h-full"
        >
            {members?.map((member) => {
                return (
                    <span key={member._id}>
                        <Member member={member} host={member._id === hostId} />
                    </span>
                )
            })}
        </div>
    )
}
