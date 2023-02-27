import Authenticate from "../../../src/server/authenticate"
import connectToDatabase from "../../../src/server/db"
import { User } from "../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    res.setHeader("content-type", "application/json")
    const { code: CODE } = req.body

    if (!CODE) {
        res.status(400).send(JSON.stringify({ message: "Bad Request" }))
        return
    }

    const codeSended = "123456"

    if (CODE !== codeSended) {
        res.status(400).send(JSON.stringify({ message: "Invalid Code" }))
        return
    }

    const user = await Authenticate(req, res)

    if (!user) {
        return
    }

    // get the initial code sent to this user's email address

    await User.updateOne({ _id: user._id }, { active: true })

    res.status(200).send(JSON.stringify({ message: "Activated" }))
}
