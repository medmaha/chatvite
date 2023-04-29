import connectToDatabase from "../../../src/server/db"
import { User } from "../../../src/server/mongodb/collections"
import bcrypt from "bcrypt"

export default async function handler(req, res) {
    res.setHeader("Content-Type", "application/json")
    await connectToDatabase()

    const data = req.body

    const email = data.email
    const password = data.password

    const user = await User.findOne({ email }).populate("password")

    if (!user) {
        res.status(400).send(JSON.stringify({ message: "Invalid credentials" }))
        return
    }

    const hash = user.password

    const passwordMatched = await bcrypt.compare(password, hash)

    if (passwordMatched == true) {
        const data = await User.findOne(
            { _id: user._id },
            { _id: 1, name: 1, avatar: 1, username: 1, active: 1 },
        )
        res.status(200).send(JSON.stringify(data.toJSON()))
    } else {
        res.status(400).send(JSON.stringify({ message: "Invalid credentials" }))
    }
}
