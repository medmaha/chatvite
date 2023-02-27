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
import axios from "axios"

export default function Create() {
    const [close, setClose] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setCreateRoom } = useContext(GlobalContext)

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

        axios
            .post(
                "/api/topic/create",
                { topic, room, description },
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                const room = new CustomEvent("room", {
                    detail: {
                        data: res.data,
                    },
                })
                document.dispatchEvent(room)
                setLoading(false)
                setClose(true)
            })
            .catch((err) => {
                if (err.response) {
                    alert(err.response.data.message)
                }
                console.log(err)
            })
            .finally(() => setLoading(false))
    }

    function handleModalClose() {
        setCreateRoom(false)
    }
    return (
        <Modal
            close={close}
            onClose={handleModalClose}
            loading={loading}
            title="Create Room"
            content={
                <Form loading={loading} handleFormSubmit={handleFormSubmit} />
            }
        />
    )
}
