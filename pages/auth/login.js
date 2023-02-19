import React from "react"

import { Login } from "../../src/client/components/auth"
import { authOptions } from "../api/auth/[...nextauth]"

import { getServerSession } from "next-auth/next"

export default function login() {
    return (
        <div className="flex justify-center mt-8 px-2">
            <Login />
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions,
    )

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
        props: {},
    }
}
