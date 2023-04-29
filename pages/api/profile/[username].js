// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    User,
    Activity,
    Room,
    Chat,
} from "../../../src/server/mongodb/collections"
import Authenticate from "../../../src/server/authenticate"
import Users from "../../../src/server/mongodb/collections/users"

export default async function handler(req, res) {
    const authUser = await Authenticate(req, res, { sendResponse: false })

    const { username } = req.query
    const profileUser = await User.findOne(
        { username },
        {
            followers: 1,
            password: 0,
            active: 0,
            email: Number(Boolean(authUser)),
        },
        { populate: "followers" },
    )

    if (profileUser) {
        const data = {
            account: profileUser.toJSON(),
        }

        const rooms = await Room.find(
            {
                host: profileUser._id,
            },
            { AI_MODEL: 0 },
        ).limit(15)

        data["rooms"] = rooms
            .flatMap((_room) => {
                const data = {
                    _id: _room.id,
                    name: _room.name,
                    host: _room.host,
                    slug: _room.slug,
                    topic: {
                        _id: _room.topic.id,
                        name: _room.topic.name,
                        slug: _room.topic.name,
                    },
                    chats: _room.chatfuses.length,
                    members: _room.members.length,
                    createdAt: _room.createdAt,
                }
                return data
            })
            .sort((a, b) => b.chats - a.chats)

        const activities = await Activity.find({
            "sender.username": username,
        })
            .populate(["sender", "room", "topic"])
            .sort({ createdAt: -1 })
            .limit(15)

        data["activities"] = activities.flatMap((_activity) => {
            const data = {
                _id: _activity.id,
                action: _activity.action,
                createdAt: _activity.createdAt,
                message: _activity.message,
                topic: {
                    _id: _activity.topic.id,
                    name: _activity.topic.name,
                    slug: _activity.topic.slug,
                },
                sender: {
                    _id: _activity.sender.id,
                    name: _activity.sender.name,
                    username: _activity.sender.username,
                    // slug: _activity.sender.slug,
                },
                room: {
                    _id: _room.id,
                    name: _room.name,
                    slug: _room.slug,
                },
            }
            return data
        })

        const stats = async () => {
            const rooms = await Room.find(
                {
                    host: profileUser._id,
                },
                { host: 1 },
                {
                    strict: false,
                    strictQuery: false,
                    populate: [
                        {
                            path: "host",
                            select: ["followers"],
                            strictPopulate: false,
                        },
                    ],
                },
            )

            const chats = await Chat.find({
                sender: profileUser._id,
            })

            return [
                {
                    name: "Follow",
                    stats: profileUser.followers.length,
                    data: [
                        ...profileUser.followers.map((_follower) => ({
                            _id: _follower._id,
                            // avatar: _follower.avatar,
                            // username: _follower.username,
                        })),
                    ],
                },
                { name: "Chatrooms", stats: rooms.length },
                { name: "Following", stats: profileUser.following.length },
                { name: "Chats", stats: chats.length },
            ]
        }

        data["stats"] = await stats()

        res.setHeader("Content-Type", "application/json")
        res.status(200).send(JSON.stringify(data))
        return
    }

    res.setHeader("Content-Type", "application/json")
    res.status(404).send(JSON.stringify({ message: "Not Found" }))
}
