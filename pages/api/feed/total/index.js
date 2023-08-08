import { Room } from "../../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    const roomsCount = await Room.count({})

    return res.status(200).json({ count: roomsCount + 10 })
}
