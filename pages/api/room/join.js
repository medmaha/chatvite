import { NextResponse } from "next/server"
import Authenticate from "../../../src/server/authenticate"
import { User, Room } from "../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    const user = await Authenticate(req, res)

    res.setHeader("content-type", "application/json")
    if (!user) {
        return res.status(401).send(
            JSON.stringify({
                message: "You are unauthorize for this request",
            }),
        )
    }

    const { id, room: returnRoom } = req.body

    const room = await Room.findById(id).populate("members")

    if (!room) {
        res.status(400).send(JSON.stringify({ message: "Room does not exist" }))
        return res.end()
    }

    const isMember = room.members.find((member) => {
        return member.id === user.id
    })

    let joined

    if (!isMember) {
        room.members.push(user._id)
        joined = true
    } else {
        room.members = room.members.filter((member) => {
            return member.id !== user.id
        })
        joined = false
    }
    await room.save()

    const data = {
        room: returnRoom ? room : false,
        joined: joined,
    }

    res.setHeader("Content-Type", "application/json")
    res.status(200).send(JSON.stringify(data))
}
