import Authenticate from "../../../../src/server/authenticate"
import connectToDatabase from "../../../../src/server/db"
import { User } from "../../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    // const authUser = await Authenticate(req, res)

    // if (!authUser) {
    //     return
    // }

    await connectToDatabase()

    const { id } = req.query

    console.log("id: ", id)
    const user = await User.findById(id, {
        _id: 1,
        name: 1,
        email: 1,
        active: 1,
        avatar: 1,
        username: 1,
    })

    if (!user) {
        res.setHeader("content-type", "application/json")
        res.status(404).send(JSON.stringify({ message: "Not found" }))
        return
    }

    res.setHeader("content-type", "application/json")
    res.status(200).send(JSON.stringify(user.toJSON()))
}
