import Authenticate from "../../../../src/server/authenticate"
import { User } from "../../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    const authUser = await Authenticate(req, res)

    if (!authUser) return res.end()

    res.setHeader("content-type", "application/json")

    const { userId = "" } = req.body

    if (!userId || userId.length !== 24) {
        res.status(400).json({
            message: "Oops! Bad request made on following user",
        })
        return res.end()
    }

    const user = await User.findById(userId, { followers: 1 })

    if (!user) {
        res.status(404).json({
            message: "Cannot find the user to follow",
        })
        return res.end()
    }

    const _following = !!user.followers.find(
        (_member) => _member.username === authUser.username,
    )

    let isFollowing
    if (_following) {
        user.followers = user.followers.filter(
            (_member) => _member.id !== authUser.id,
        )
        isFollowing = false
    } else {
        user.followers.push(authUser._id)
        isFollowing = true
    }
    await user.save()

    res.status(200).json({ isFollowing })
    return res.end()
}
