import connectToDatabase from "../../../src/server/db"
import Authenticate from "../../../src/server/authenticate"
import { Topic } from "../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    await connectToDatabase()

    const user = await Authenticate(req, res)

    if (!user) {
        return Promise.resolve()
    }

    const { id } = JSON.parse(req.body)

    const topic = await Topic.findById(id)

    const isMember = topic.followers.find((member) => {
        return member.id === user.id
    })

    let joined

    if (!isMember) {
        topic.followers.push({
            name: user.name,
            username: user.username,
            id: user.id,
            avatar: user.avatar,
        })
        joined = true
    } else {
        topic.followers = topic.followers.filter((member) => {
            return member.id !== user.id
        })
        joined = false
    }
    await topic.save()

    res.status(200).json({ joined: joined })
    res.end()
}
