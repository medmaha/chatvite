import { getServerSession } from "next-auth/next"
import { authOptions } from "../../pages/api/auth/[...nextauth]"
import connectToDatabase from "./db"
import { getSession } from "next-auth/react"

import { User } from "./mongodb/collections"

export default async function Authenticate(
    req,
    res,
    options = { sendResponse: true },
) {
    const session = await getServerSession(req, res, authOptions(req, res))

    if (!session) {
        if (options.sendResponse) {
            res.setHeader("content-type", "application/json")
            res.status(401).send(JSON.stringify({ message: "Unauthorize ses" }))
        }
        return null
    }

    await connectToDatabase()

    const auth_user = session.user
    const user = await User.findById(auth_user._id, {
        followers: 0,
        following: 0,
        email: 0,
        password: 0,
        createdAt: 0,
    })

    if (!user) {
        if (options.sendResponse) {
            res.setHeader("content-type", "application/json")
            res.status(401).send(JSON.stringify({ message: "Unauthorize usr" }))
        }
        return null
    }

    return user
}
