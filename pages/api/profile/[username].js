// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    User,
    Activity,
    Room,
    Chat,
} from "../../../src/server/mongodb/collections"
import connectToDatabase from "../../../src/server/db"

export default async function handler(req, res) {
    await connectToDatabase()

    const { username } = req.query
    const user = await User.findOne({ username }, { password: 0 })

    if (user) {
        const data = {
            account: { ...user.toJSON(), id: user.id },
        }

        const activities = await Activity.find({
            "sender.username": username,
        })

            .sort({ createdAt: -1 })
            .limit(15)

        const rooms = await Room.find({
            host: user._id,
        })
            .limit(15)
            .sort({ chatfuses: 1 })

        data["activities"] = activities.flatMap((activity) => {
            const data = {
                ...activity.toJSON(),
                id: activity.id,
            }
            return data
        })

        data["rooms"] = rooms.flatMap((activity) => {
            const data = {
                ...activity.toJSON(),
                id: activity.id,
            }
            return data
        })

        const stats = async () => {
            const rooms = await Room.find({
                host: user._id,
            })
            const chats = await Chat.find({
                sender: user._id,
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
