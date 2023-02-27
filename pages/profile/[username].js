import React from "react"
import ProfileAccount from "../../src/client/components/profile"
import axios from "axios"

export default function Profile({ data }) {
    return <ProfileAccount data={data || {}} />
}

export async function getServerSideProps(context) {
    const { username } = context.params

    const res = await axios.get(
        `${process.env.BASE_URL}/api/profile/${username}`,
    )

    if (res.data) {
        return {
            props: { data: res.data },
        }
    }

    return {
        props: {},
    }
}
