import React from "react"
import ProfileAccount from "../../src/client/components/profile"
import axios from "axios"

export default function Profile({ data, username }) {
    return <ProfileAccount data={data || {}} username={username} />
}

export async function getServerSideProps(context = Nex) {
    const { username } = context.params
    console.log(username)
    try {
        const res = await axios.get(
            `${process.env.BASE_URL}/api/profile/${username}`,
            {
                withCredentials: true,
                headers: { cookie: context.req.headers.cookie },
            },
        )

        return {
            props: { data: res.data, username },
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
