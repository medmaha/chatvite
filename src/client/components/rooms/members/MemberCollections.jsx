import React, { useRef, useLayoutEffect } from "react"
import Member from "./Member"

export default function MemberCollections({ host, members }) {
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
            className="p-[.5em] overflow-hidden overflow-y-auto"
        >
            {members?.map((member) => {
                return (
                    <span key={member.id}>
                        <Member member={member} host={member.id === host.id} />
                    </span>
                )
            })}
        </div>
    )
}
