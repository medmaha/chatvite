import React from "react"
import axios from "axios"

import Feed from "../../src/client/components/feeds"

export default function Index({ feeds }) {
    return <Feed feeds={feeds} />
}

export async function getServerSideProps() {
    const res = await axios.get(`${process.env.BASE_URL}/api/feed`, {
        // timeout: 15000,
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
