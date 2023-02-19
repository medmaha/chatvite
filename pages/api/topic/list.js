// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Topic } from "../../../src/server/mongodb/collections"
import connectToDatabase from "../../../src/server/db"

export default async function handler(req, res) {
    await connectToDatabase()

    const topics = await Topic.find()

    res.status(200).json(topics)
}
