// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDatabase from "../../../src/server/db"
import { Room } from "../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    await connectToDatabase()

    const rooms = await Room.find().sort({ chatfuses: -1 })

    res.status(200).json(rooms)
}
