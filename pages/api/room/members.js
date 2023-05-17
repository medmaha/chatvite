import connectToDatabase from "../../../src/server/db"
import { Room, User } from "../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    const { rid = "" } = urlStringToObject(req.url)

    res.setHeader("content-type", "application/json")

    if (rid.length !== 24) {
        res.status(404).json({ message: "Invalid room identifier provided" })
        return res.end()
    }

    await connectToDatabase()
    const room = await Room.findById(
        rid,
        { members: 1 },
        {
            populate: [
                {
                    path: "members",
                },
            ],
        },
    )

    if (!room) {
        res.status(404).json({
            message: "Room with these identifier does not exist",
        })
        return res.end()
    }

    const userNames = room.members.map((_user) => _user.username)

    const members = await User.find(
        { username: { $in: userNames } },
        {
            password: 0,
            email: 0,
            active: 0,
            __v: 0,
            following: 0,
            followers: 1,
        },
    )
    res.status(200).json(members)
}

function urlStringToObject(url) {
    const query = url?.split("?")[1]
    const obj = {}
    if (query) {
        const queries = query.split("&")
        for (const q of queries) {
            const [key, value] = q.split("=")

            obj[key] = value
        }
        return obj
    }
    return obj
}
