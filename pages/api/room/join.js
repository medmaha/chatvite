import connectToDatabase from "../../../src/server/db"
import Authenticate from "../../../src/server/authenticate"
import { User, Room } from "../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    await connectToDatabase()

    const user = await Authenticate(req, res)

    if (!user) {
        return Promise.resolve()
    }

    const { id } = JSON.parse(req.body)

    const room = await Room.findById(id)

    const isMember = room.members.find((member) => {
        return member.id === user.id
    })

    let joined

    if (!isMember) {
        room.members.push({
            name: user.name,
            username: user.username,
            id: user.id,
            avatar: user.avatar,
        })
        joined = true
    } else {
        room.members = room.members.filter((member) => {
            return member.id !== user.id
        })
        joined = false
    }
    await room.save()

    res.setHeader("Content-Type", "application/json")
    res.status(200).send(JSON.stringify({ joined: joined }))
}
