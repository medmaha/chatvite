import {
    User,
    Activity,
    Room,
    Chat,
} from "../../../src/server/mongodb/collections"
import Authenticate from "../../../src/server/authenticate"
import connectToDatabase from "../../../src/server/db"

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        res.setHeader("content-type", "application/json")
        res.status(405).send(JSON.stringify({ detail: "Method not allowed" }))
        return
    }

    const authUser = await Authenticate(req, res)

    if (!authUser) {
        return
    }

    const data = req.body

    const user = await User.findById(authUser.id)

    if (!user) {
        res.setHeader("content-type", "application/json")
        res.status(401).send(JSON.stringify({ detail: "Not Authorized" }))
        return
    }

    const textData = {
        name: (() => {
            if (data.name?.length > 4) return data.name
            return user.name
        })(),
        email: (() => {
            if (data.email?.length > 4) return data.email
            return user.email
        })(),
        avatar: (() => {
            if (data.avatar?.length > 5) return data.avatar
            return user.avatar
        })(),
        username: (() => {
            if (data.username?.length > 4) return data.username
            return user.username
        })(),
    }

    await User.updateOne({ _id: user._id }, textData)

    const _data = await User.findOne(
        { _id: user._id },
        { _id: 1, name: 1, avatar: 1, username: 1, active: 1 },
    )

    const passwordData = {
        "current-password": data["current-password"],
        "new-password": data["current-password"],
    }

    res.setHeader("content-type", "application/json")
    res.status(200).send(JSON.stringify(_data.toJSON()))
}
