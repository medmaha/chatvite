// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Topic, Room } from "../../../src/server/mongodb/collections"

import Authenticate from "../../../src/server/authenticate"

export default async function handler(req, res) {
    const user = await Authenticate(req, res)

    if (!user) {
        return Promise.resolve()
    }

    const data = req.body

    const { topic: topicName, room: roomName, description } = data

    let topic = await Topic.findOne({ name: topicName })

    if (!topic) {
        topic = await Topic.create({
            name: topicName,
            creator: {
                id: user.id,
                name: user.name,
                username: user.username,
                avatar: user.avatar,
            },
        })
    }

    const room = await Room.create({
        name: roomName,
        description: description,
        topic: { id: topic.id, name: topic.name, slug: topic.slug },
        host: {
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
        },
    })

    // res.status(200).json({ topic: _topic })

    res.setHeader("Content-Type", "application/json")
    res.status(201).send(
        JSON.stringify({
            id: room.id,
            name: room.name,
            slug: room.slug,
            topic: { id: topic.id, name: topic.name, slug: topic.slug },
            host: {
                id: room.host.id,
                name: room.host.name,
                username: room.host.username,
                avatar: room.host.avatar,
            },
            chatfuses: [],
            updatedAt: room.updatedAt,
        }),
    )
}
