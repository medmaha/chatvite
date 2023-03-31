import { Router, useRouter } from "next/router"
import React, { useEffect } from "react"
import Room from "../../src/client/components/rooms"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
import axios from "axios"

export default function RoomView({ room }) {
    // send a message to the server

    if (room) return <Room data={room} />
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
                Authorization: "Bearer " + session.user?._id || "",
            },
        })

        return {
            props: {
                room: data,
            },
        }
    } catch (error) {
        console.log(error.message)
        return {
            redirect: {
                destination: "/feed",
                permanent: false,
            },
        }
    }
}
