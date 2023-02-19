import { getServerSession } from "next-auth/next"
import { authOptions } from "../../pages/api/auth/[...nextauth]"
import connectToDatabase from "./db"

import { User } from "./mongodb/collections"

export default async function Authenticate(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        res.status(401).json({ message: "Unauthorize" })
        res.end()
        return null
    }

    await connectToDatabase()

    const auth_user = session.user
    const user = await User.findById(auth_user.id)

    if (!user) {
        res.status(401).json({ message: "Unauthorize" })
        res.end()
        return null
    }

    return user
}
