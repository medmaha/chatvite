import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: "Email",

            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials, req) {
                const email = credentials.email
                const password = credentials.password

                const res = await fetch(
                    `${process.env.BASE_URL}/api/auth/login`,
                    {
                        method: "post",
                        body: JSON.stringify({ email, password }),
                    },
                )

                const data = await res.json()

                if (data?.message) {
                    throw new Error(data.message)
                }

                return data.user
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },

    // cookies: {
    //     csrfToken: {
    //         name: "__csrftoken",
    //     },
    //     sessionToken: {
    //         name: "__sid",
    //     },
    //     callbackUrl: {
    //         name: "__cb_u",
    //     },
    // },

    // secret: "test",
    jwt: {
        secret: "test",
        encryption: true,
    },

    session: {
        strategy: "jwt",

        maxAge: 24 * 60 * 60, // 24 hours

        updateAge: 2 * 24 * 60 * 60, // 48 hours

        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString("hex")
        },
    },
    callbacks: {
        // async redirect({ url, baseUrl }) {
        //     return baseUrl
        // },
        async jwt({ token, user }) {
            if (user) {
                token.wechat = true
                token.user = user
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.wechat = token.wechat
                session.user = token.user
            }
            return session
        },
    },
}

export default NextAuth(authOptions)
