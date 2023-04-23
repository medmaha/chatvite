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
    var user,
        authUser = null
    const sessionUser = session?.user
    const headers = req.headers.authorization

    await connectToDatabase()
    if (sessionUser) {
        user = await User.findById(sessionUser._id, {
            id: 1,
            _id: 1,
            name: 1,
            avatar: 1,
            username: 1,
        })
    } else if (headers) {
        const token = headers.split("Bearer ")[1] || null
        if (token.length === 24) {
            authUser = await User.findById(token, {
                id: 1,
                _id: 1,
                name: 1,
                avatar: 1,
                username: 1,
            })
        }
    }

    if (!authUser && !user && !session) {
        if (options.sendResponse) {
            res.setHeader("content-type", "application/json")
            res.status(401).send(JSON.stringify({ message: "Unauthorize usr" }))
        }
        return null
    }

    return user || authUser
}
