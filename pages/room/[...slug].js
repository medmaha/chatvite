import { Router, useRouter } from "next/router"
import React, { useEffect } from "react"
import Room from "../../src/client/components/rooms"
import { useSession } from "next-auth/react"

export default function RoomView({ room }) {
    // send a message to the server

    return <Room data={room} />
}

export async function getStaticPaths__() {
    const res = await fetch("http://localhost:3000/api/feed", {
        credentials: "include",
    })

    const feeds = await res.json()

    const paths = feeds.map((data) => {
        return { params: { slug: [data.slug] } }
    })

    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps__(context) {
    const params = context.params

    const res = await fetch(`http://localhost:3000/api/room/${params.slug}`, {
        credentials: "include",
    })
    const feed = await res.json()

    return { props: { room: feed, pk: Math.random().toString() } }
}

export async function getServerSideProps(context) {
    const { params, req } = context
    const baseUrl = process.env.BASE_URL

    const cookie = req.headers.cookie

    const roomRes = await fetch(`${baseUrl}/api/room/${params.slug}`, {
        headers: { cookie },
    })

    const room = await roomRes.json()

    return {
        props: {
            room,
        },
    }
}
