import connectToDatabase from "../../../src/server/db"
import Authenticate from "../../../src/server/authenticate"
import { Topic } from "../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    await connectToDatabase()

    const user = await Authenticate(req, res)

    if (!user) {
        return
    }

    const { id } = req.body

    const topic = await Topic.findById(id)

    const isMember = topic.followers.find((member) => {
        return member.id === user.id
    })

    let joined

    if (!isMember) {
        topic.followers.push(user._id)
        joined = true
    } else {
        topic.followers = topic.followers.filter((member) => {
            return member.id !== user.id
        })
        joined = false
    }
    await topic.save()

    res.setHeader("Content-Type", "application/json")
    res.status(200).send(JSON.stringify({ joined: joined }))
}
