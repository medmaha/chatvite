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
        res.status(400).json({ message: "Bad Request" })
        res.end()
        return Promise.resolve()
    }

    res.status(200).json(room)
}
