import React from "react"
import Verify from "../../src/client/components/auth/Verify"
import { authOptions } from "../api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { getCsrfToken } from "next-auth/react"

export default function verify({ activated, csrfToken }) {
    return (
        <div>
            <Verify activated={activated} csrf={csrfToken} />
        </div>
    )
}

export const getServerSideProps = async (context) => {
    const { req, res } = context

    if (req && res) {
        const session = await getServerSession(req, res, authOptions(req, res))
        const csrfToken = await getCsrfToken(context)

        if (session) {
            const { active, name } = session.user

            if (active && name) {
                return {
                    redirect: {
                        destination: "/feed",
                        permanent: false,
                        replace: true,
                    },
                }
            }
            return {
                props: {
                    activated: !!active,
                    csrfToken,
                },
            }
        }

        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
                replace: true,
            },
        }
    }

    return {
        props: {},
    }
}
