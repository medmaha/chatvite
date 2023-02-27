import React from "react"
import { Signup } from "../../src/client/components/auth"
import { authOptions } from "../api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { getCsrfToken } from "next-auth/react"

export default function signup({ csrfToken }) {
    return (
        <>
            <Signup csrfToken={csrfToken} />
        </>
    )
}

export const getServerSideProps = async (context) => {
    const { req, res } = context
    const session = await getServerSession(req, res, authOptions(req, res))
    const csrfToken = await getCsrfToken(context)

    if (session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
                replace: true,
            },
        }
    }

    return {
        props: { csrfToken },
    }
}
