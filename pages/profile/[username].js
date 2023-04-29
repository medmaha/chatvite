import React from "react"
import ProfileAccount from "../../src/client/components/profile"
import axios from "axios"

export default function Profile({ data }) {
    return <ProfileAccount data={data || {}} />
}

export async function getServerSideProps(context = Nex) {
    const { username } = context.params

    try {
        const res = await axios.get(
            `${process.env.BASE_URL}/api/profile/${username}`,
            { withCredentials: true, cookies: context.req.headers.cookie },
        )

        return {
            props: { data: res.data },
        }
    } catch (error) {
        console.error(error.message)
        return {
            redirect: {
                destination: "/feed",
                permanent: false,
                replace: true,
            },
        }
    }
}
