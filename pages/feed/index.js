import React from "react"
import axios from "axios"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"

import Feed from "../../src/client/components/feeds"

export default function Index({ feeds, roomsCount }) {
    return <Feed feeds={feeds} roomsCount={roomsCount} />
}

export async function getServerSideProps(ctx) {
    const session = await getServerSession(
        ctx.req,
        ctx.res,
        authOptions(ctx.req, ctx.res),
    )

    const baseUrl = process.env.BASE_URL

    try {
        const { data } = await axios.get(`${baseUrl}/api/feed`, {
            headers: {
                cookie: ctx.req.headers.cookie,
                Authorization: "Bearer " + session?.user?._id || "",
            },
        })
        const { data: roomsCount } = await axios.get(
            `${baseUrl}/api/feed/total`,
            {},
        )

        if (data) {
            return {
                props: {
                    feeds: data,
                    roomsCount: roomsCount.count,
                },
            }
        }
    } catch (error) {
        console.log(error.message)
    }

    return {
        props: {
            feeds: [],
            roomsCount: 0,
        },
    }
}
