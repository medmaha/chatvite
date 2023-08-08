import Authenticate from "../../../src/server/authenticate"
import { Room } from "../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    const authUser = await Authenticate(req, res)

    if (!authUser) {
        return
    }

    const rooms = (
        await Room.find({
            host: authUser._id,
        })
    ).flatMap((room) => {
        return {
            name: room.name,
            slug: room.slug,
            members: room.members.length,
            description: room.description,
            createdAt: room.createdAt,
            chatfuses: room.chatfuses.length,
            isPrivate: room.isPrivate,
            topic: {
                name: room.topic.name,
                slug: room.topic.slug,
                _id: room.topic._id,
            },
        }
    })

    const public_rooms = rooms.filter((r) => !r.isPrivate)
    const private_rooms = rooms.filter((r) => r.isPrivate)

    const joined_rooms = (
        await Room.find({
            host: { $ne: authUser._id },
            members: { $in: [authUser._id] },
        })
    ).flatMap((room) => {
        return {
            host: room.host,
            name: room.name,
            slug: room.slug,
            createdAt: room.createdAt,
            members: room.members.length,
            description: room.description,
            chatfuses: room.chatfuses.length,
            topic: {
                name: room.topic.name,
                slug: room.topic.slug,
                _id: room.topic._id,
            },
        }
    })

    const data = {
        joined: joined_rooms,
        private: private_rooms,
        public: public_rooms,
    }

    res.setHeader("content-type", "application/json")
    res.status(200).send(data)
}
