import { Router, useRouter } from "next/router"
import React, { useEffect } from "react"
import Room from "../../src/client/components/rooms"
import { useSession } from "next-auth/react"
import axios from "axios"

export default function RoomView({ room }) {
    // send a message to the server

    if (room) return <Room data={room} />
    else return <></>
}

export async function getServerSideProps(context) {
    const { params } = context
    const baseUrl = process.env.BASE_URL
    try {
        const { data } = await axios.get(`${baseUrl}/api/room/${params.slug}`)
        return {
            props: {
                room: data,
            },
        }
    } catch (error) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        }
    }
}
