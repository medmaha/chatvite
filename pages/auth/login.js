import { Login } from "../../src/client/components/auth"
import { authOptions } from "../api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { getCsrfToken, getSession } from "next-auth/react"

export default function SignIn({ csrfToken }) {
    return (
        <div className="flex justify-center mt-8 px-2">
            <Login csrfToken={csrfToken} />
        </div>
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
