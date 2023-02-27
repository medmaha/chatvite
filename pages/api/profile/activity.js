// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Activity, User } from "../../../src/server/mongodb/collections"
import connectToDatabase from "../../../src/server/db"

export default async function handler(req, res) {
    await connectToDatabase()

    const { username } = req.query
    const user = await User.findOne({ username })

    if (user) {
        const activities = await Activity.find({ "sender.username": username })

        if (activities) {
            const data = {
                ...activities.toJSON(),
                id: activities.id,
            }
            delete data["_id"]

            res.setHeader("Content-Type", "application/json")
            res.status(200).send(JSON.stringify(data))
            return
        }
    }

    res.setHeader("Content-Type", "application/json")
    res.status(404).send(JSON.stringify({ message: "Not Found" }))
}
