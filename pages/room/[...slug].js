import { Router, useRouter } from "next/router"
import React, { useEffect } from "react"
import Room from "../../src/client/components/rooms"
import { useSession } from "next-auth/react"
import axios from "axios"

export default function RoomView({ room }) {
    // send a message to the server

    return <Room data={room} />
}

export async function getServerSideProps(context) {
    const { params } = context
    const baseUrl = process.env.BASE_URL
    const res = await axios.get(`${baseUrl}/api/room/${params.slug}`)

    if (res.data) {
        return {
            props: {
                room: res.data,
            },
        }
    }
    return {
        props: {
            room: {},
        },
    }
}
