import mongoose from "mongoose"
import connectToDatabase from "../../../src/server/db"
import { User } from "../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    await connectToDatabase()

    const data = JSON.parse(req.body)

    const email = data.email
    const password = data.password

    const user = await User.findOne({ email, password })

    if (!user) {
        res.setHeader("Content-Type", "application/json")
        res.status(400).send({ message: "credential does not match" })
    } else {
        const data = {
            id: user.id,
            name: user.name,
            avatar: "/img/avatar.png",
            username: user.username,
        }

        res.setHeader("Content-Type", "application/json")
        res.status(200).send(JSON.stringify({ user: data }))
    }
    return Promise.resolve()
}
