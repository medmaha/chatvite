// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Topic } from "../../../src/server/mongodb/collections"
import connectToDatabase from "../../../src/server/db"

export default async function handler(req, res) {
    await connectToDatabase()

    const topics = await Topic.find()

    res.setHeader("Content-Type", "application/json")
    res.status(200).send(JSON.stringify(topics))
}
