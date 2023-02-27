// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Activity } from "../../../src/server/mongodb/collections"
import connectToDatabase from "../../../src/server/db"

export default async function handler(req, res) {
    await connectToDatabase()

    const activities = await Activity.find().limit(10).sort({ updatedAt: -1 })

    res.setHeader("Content-Type", "application/json")
    res.status(200).send(JSON.stringify(activities.reverse()))
}
