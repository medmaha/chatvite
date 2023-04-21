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
    const [roomType, setRoomType] = useState(null)
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
                { topic, room, description, isPrivate: roomType === "Private" },
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
                    console.error(err.response.data.message)
                    return
                }
                console.error(err.message)
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
            title={roomType ? roomType + " Chat Room" : ""}
            content={
                <>
                    {roomType && (
                        <Form
                            loading={loading}
                            handleFormSubmit={handleFormSubmit}
                        />
                    )}
                    {!roomType && (
                        <RoomTypeSelection setRoomType={setRoomType} />
                    )}
                </>
            }
        />
    )
}

function RoomTypeSelection({ setRoomType }) {
    const [types, setTypes] = useState({
        group: {
            name: "group-chat",
            value: "Group",
            desc: "This room is publicly publish, meaning any user can view or join the conversation",
        },
        private: {
            name: "private-chat",
            value: "Private",
            desc: "One to one messaging with an AI BOT. Accessible to you only, no other user can join this conversation",
        },
    })
    const [selectedType, setSelectedType] = useState(types.private)

    return (
        <div className="w-full h-full">
            <div className="h-full w-full flex justify-center">
                <div className="flex w-full max-w-[350px] h-full flex-col gap-4 justify-center items-center">
                    <div className="mb-2 pb-2">
                        <h3 className="text-lg text-center p-0 m-0 leading-none font-bold">
                            Chat Room
                        </h3>
                        <p className="text-center py-1 text-sm font-semibold tracking-wide">
                            To get started select a chat room!
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedType(types.private)
                        }}
                        className={`
                    p-2 mb-2 bg-gray-500 outline-[2px] outline-sky-500 outline-offset-[4px] text-xl tracking-wider rounded-md w-full font-semibold transition opacity-90 hover:opacity-100 ${
                        selectedType?.name === "private-chat"
                            ? "outline text-sky-400"
                            : ""
                    }`}
                    >
                        Private
                    </button>
                    <button
                        onClick={() => {
                            setSelectedType(types.group)
                        }}
                        className={`
                    p-2 mb-2 bg-gray-500 outline-sky-500 outline-[2px] outline-offset-[4px] text-xl tracking-wider rounded-md w-full font-semibold transition-[outline] opacity-90 hover:opacity-100 ${
                        selectedType?.name === "group-chat"
                            ? "outline text-sky-400"
                            : ""
                    }
                    `}
                    >
                        Public
                    </button>

                    <p className="py-2 text-center text-gray-300 text-sm">
                        {selectedType?.desc}
                    </p>
                    <div className="flex-1 mt-4 justify-end">
                        <button
                            onClick={() => {
                                setRoomType(selectedType.value)
                            }}
                            className={`p-2 px-4 text-lg rounded-md w-full font-semibold ${
                                selectedType?.value
                                    ? "bg-sky-500"
                                    : "bg-gray-500"
                            }`}
                        >
                            Create Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
