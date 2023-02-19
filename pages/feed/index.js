import React from "react"
import axios from "axios"

import Feed from "../../src/client/components/feeds"

export default function index({ feeds }) {
    return <Feed feeds={feeds} />
}

export async function getServerSideProps() {
    const res = await axios({
        url: `${process.env.BASE_URL}/api/feed`,
        method: "get",
    })

    if (res.data) {
        return {
            props: {
                feeds: res.data,
            },
        }
    }
    return {
        props: {
            feeds: [],
        },
    }
}
