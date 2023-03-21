// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    User,
    Activity,
    Room,
    Chat,
} from "../../../src/server/mongodb/collections"
import Authenticate from "../../../src/server/authenticate"

export default async function handler(req, res) {
    const authUser = await Authenticate(req, res, { sendResponse: false })

    const { username } = req.query
    const profileUser = await User.findOne({ username }, { password: 0 })

    if (profileUser) {
        const data = {
            account: { ...profileUser.toJSON(), id: profileUser.id },
        }

        const activities = await Activity.find({
            "sender.username": username,
        })

            .sort({ createdAt: -1 })
            .limit(15)

        const rooms = await Room.find({
            host: profileUser._id,
        })
            .sort({ "chatfuses.length": 1 })
            .limit(15)

        data["activities"] = activities.flatMap((activity) => {
            const data = {
                ...activity.toJSON(),
                id: activity.id,
            }
            return data
        })

        data["rooms"] = rooms
            .flatMap((activity) => {
                const data = {
                    ...activity.toJSON(),
                    id: activity.id,
                    name: activity.name,
                    slug: activity.slug,
                    topic: activity.topic,
                    chats: activity.chatfuses.length,
                    members: activity.members.length,
                    host_id: activity.host.id,
                }
                return data
            })
            .sort((a, b) => b.chatfuses.length - a.chatfuses.length)

        const stats = async () => {
            const rooms = await Room.find({
                host: profileUser._id,
            })
            const chats = await Chat.find({
                sender: profileUser._id,
            })

            return [
                { name: "Rooms Hosted", stats: rooms.length },
                { name: "Followers", stats: 0 },
                { name: "Following", stats: 0 },
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
