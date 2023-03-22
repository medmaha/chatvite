// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDatabase from "../../../src/server/db"
import Authenticate from "../../../src/server/authenticate"
import { Room } from "../../../src/server/mongodb/collections"

// import io from "../../socket"

export default async function handler(req, res) {
    await connectToDatabase()
    const { slug } = req.query

    const room = await Room.findOne({ slug })

    res.setHeader("Content-Type", "application/json")

    if (!room) {
        res.status(404).json({ message: "Bad Request" })
        res.end()
        return Promise.resolve()
    }

    if (room.isPrivate) {
        const data = room.toJSON()
        delete data["members"]
        res.status(200).send(JSON.stringify(data))
        return
    }

    res.status(200).send(JSON.stringify(room.toJSON()))
}
