import React from "react"
import axios from "axios"

import Feed from "../../src/client/components/feeds"

export default function index({ feeds }) {
    return <Feed feeds={feeds} />
}

export async function getServerSideProps() {
    const res = await axios.get(`${process.env.BASE_URL}/api/feed`, {
        timeout: 30000,
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
