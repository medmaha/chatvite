import React from "react"

import Feed from "../../src/client/components/feeds"

export default function index({ feeds }) {
    return <Feed feeds={feeds} />
}

export async function getServerSideProps() {
    const res = await fetch(`${process.env.BASE_URL}/api/feed`, {
        credentials: "include",
    })
    const feeds = await res.json()

    return {
        props: {
            feeds,
        },
    }
}
