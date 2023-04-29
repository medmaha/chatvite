import React from "react"
import axios from "axios"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"

import Feed from "../../src/client/components/feeds"

export default function Index({ feeds }) {
    return <Feed feeds={feeds} />
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

        if (data) {
            return {
                props: {
                    feeds: data,
                },
            }
        }
    } catch (error) {
        console.log(error.message)
    }

    return {
        props: {
            feeds: [],
        },
    }
}
