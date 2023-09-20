// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Topic } from "../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    const topics = await Topic.find()

    res.setHeader("Content-Type", "application/json")
    res.status(200).send(JSON.stringify(topics))
}
