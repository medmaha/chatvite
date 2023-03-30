// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDatabase from "../../../src/server/db"
import Authenticate from "../../../src/server/authenticate"
import { Room } from "../../../src/server/mongodb/collections"

// import io from "../../socket"

export default async function handler(req, res) {
    await connectToDatabase()
    const { slug } = req.query

    const room = await Room.findOne({ slug })

    if (!room) {
        res.setHeader("Content-Type", "application/json")
        res.status(404).json({ message: "Bad Request" })
        res.end()
        return Promise.resolve()
    }

    if (room.isPrivate) {
        const authUser = await Authenticate(req, res)

        if (!authUser) return

        res.setHeader("Content-Type", "application/json")

        if (room.host !== authUser._id) {
            res.status(403).send({ message: "This request is forbidden" })
            return
        }

        const data = room.toJSON()
        delete data["members"]
        res.status(200).send(JSON.stringify(data))
        return
    }

    res.status(200).send(JSON.stringify(room.toJSON()))
}
