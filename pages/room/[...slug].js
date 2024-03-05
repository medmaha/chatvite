import React, { useEffect } from "react"
import Room from "../../src/client/components/rooms"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
import axios from "axios"
import RoomWebsocketProvider from "../../src/client/components/rooms/Websocket"

export default function RoomView({ room, user }) {
    // send a message to the server

    if (room)
        return (
            <>
                <RoomWebsocketProvider room={room} user={user}>
                    <Room data={room} />
                </RoomWebsocketProvider>
            </>
        )
    else return <></>
}

export async function getServerSideProps(context) {
    const { req, res } = context
    const {
        params: { slug },
    } = context

    try {
        const session = await getServerSession(req, res, authOptions(req, res))
        const baseUrl = process.env.BASE_URL

        const { data } = await axios.get(`${baseUrl}/api/room/${slug}`, {
            headers: {
                Authorization: "Bearer " + session?.user?._id || "",
            },
        })

        return {
            props: {
                room: data,
                user: session?.user || null,
                WEBSOCKET_URL: process.env.WEBSOCKET_URL,
            },
        }
    } catch (error) {
        return {
            redirect: {
                destination: "/feed",
                permanent: false,
            },
        }
    }
}
