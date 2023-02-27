import axios from "axios"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

async function updateSession(req, token) {
    const host = req.headers.host
    const testUpdate = new URL(process.env.BASE_URL + req.url)
    if (token.user._id && testUpdate.searchParams.get("update")) {
        const userId = token.user._id
        const referer = req.headers.referer || ""
        if (referer.split(host)[1].match(/(\/profile\/|\/auth\/verify).?/g)) {
            try {
                const { data } = await axios.get(
                    `${process.env.BASE_URL}/api/profile/user/${userId}`,
                    { withCredentials: true },
                )
                token.user = data
                return Promise.resolve(0)
            } catch (error) {
                return Promise.resolve()
            }
        }
    }
    return Promise.resolve()
}

export const authOptions = (req, res) => ({
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: "Chat-Vite",

            credentials: {
                email: { type: "email" },
                "current-password": { type: "password" },
            },
            async authorize(credentials, req) {
                const email = credentials.email
                const password = credentials["current-password"]

                const errMsg = "Invalid Credentials"

                if (!!!email?.length || !!!password?.length)
                    throw new Error(errMsg)

                const { data } = await axios.post(
                    `${process.env.BASE_URL}/api/authenticate`,
                    {
                        email,
                        password,
                    },
                    { headers: { "content-type": "application/json" } },
                )

                if (data?._id) {
                    return data
                }
                throw new Error(data?.message || "An error ocurred")
            },
        }),
    ],

    pages: {
        error: "/auth/error",
        signIn: "/auth/login",
        newUser: "/feed",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user
            }
            const update = await updateSession(req, token)
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user = token.user
            }
            // await updateSession(req, session.user._id, session)
            return session
        },
    },
})

export default async function auth(req, res) {
    // Do whatever you want here, before the request is passed down to `NextAuth`

    return await NextAuth(req, res, authOptions(req, res))
}

// export default NextAuth(authOptions)
