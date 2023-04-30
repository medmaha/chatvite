// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Topic, Room } from "../../../src/server/mongodb/collections"

import Authenticate from "../../../src/server/authenticate"

export default async function handler(req, res) {
    const user = await Authenticate(req, res)

    if (!user) {
        return Promise.resolve()
    }

    const {
        topic: topicName,
        room: roomName,
        description,
        isPrivate,
    } = req.body

    res.setHeader("Content-Type", "application/json")

    let topic = await Topic.findOne({
        name: { $regex: new RegExp(`(${topicName})`, "i") },
    })

    if (topic) {
        const _room = await Room.findOne(
            {
                isPrivate,
                topic: topic,
                name: { $regex: new RegExp(`(${roomName})`, "i") },
            },
            { name: 1 },
            { populate: [{ path: "name" }, { path: "host" }] },
        )

        if (_room?.host.id === user.id) {
            res.status(400).send(
                JSON.stringify({
                    message: `You already have a room named "${_room.name}" under the category of "${topic.name}".`,
                }),
            )
            return res.end()
        }

        // if (_room) {
        //     res.status(400).send(
        //         JSON.stringify({
        //             message: `You already have a room named "${roomName}" under the category of "${topicName}".`,
        //         }),
        //     )
        //     return res.end()
        // }
    } else {
        topic = await Topic.create({
            name: topicName,
            author: user._id,
        })
    }

    try {
        const room = await Room.create({
            name: roomName,
            description: description,
            topic: topic._id,
            host: user,
            isPrivate: isPrivate,
        })
        const data = await Room.findOne(
            { _id: room._id },
            { name: 1, slug: 1, host: 1, createdAt: 1, topic: 1, isPrivate: 1 },
        )

        topic.rooms.push(data._id)
        topic.save()

        res.status(201).send(JSON.stringify(data.toJSON()))
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send(
                JSON.stringify({ message: "Room with is name already exist" }),
            )
        } else {
            res.status(400).send(JSON.stringify({ message: error.message }))
        }
    }

    return res.end()
}
