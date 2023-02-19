import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react"
import { GlobalContext } from "../../../../contexts"

import { Modal } from "../"
import Form from "./Form"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

export default function Create() {
    const [close, setClose] = useState(false)
    const [loading, setLoading] = useState(false)

    const session = useSession()
    const router = useRouter()

    async function handleFormSubmit(ev) {
        ev.preventDefault()
        if (!session.data?.user) {
            router.push("/auth/login")
            setClose(true)
            return
        }
        const topic = ev.target.topic.value
        const room = ev.target.room.value
        const description = ev.target.description.value

        setLoading(true)

        fetch("/api/topic/create", {
            credentials: "include",
            method: "post",
            body: JSON.stringify({ topic, room, description }),
        })
            .then((res) => res.json())
            .then((data) => {
                const room = new CustomEvent("room", {
                    detail: {
                        data: data,
                    },
                })
                document.dispatchEvent(room)
                setLoading(false)
                setClose(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <Modal
            close={close}
            loading={loading}
            title="Create Room"
            content={
                <Form loading={loading} handleFormSubmit={handleFormSubmit} />
            }
        />
    )
}
