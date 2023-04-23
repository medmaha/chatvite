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

    let topic = await Topic.findOne({ name: topicName })

    if (!topic) {
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
        const data = await Room.findOne({ _id: room._id })

        res.setHeader("Content-Type", "application/json")
        res.status(201).send(JSON.stringify(data.toJSON()))
    } catch (error) {
        if (error.code === 11000) {
            res.setHeader("Content-Type", "application/json")
            res.status(400).send(
                JSON.stringify({ message: "Room with is name already exist" }),
            )
        } else {
            res.setHeader("Content-Type", "application/json")
            res.status(500).send(JSON.stringify({ message: error.message }))
        }
    }
}
