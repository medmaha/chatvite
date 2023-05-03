import { NextRequest } from "next/server"
import Authenticate from "../../../src/server/authenticate"
import Users from "../../../src/server/mongodb/collections/users"

function getProfileIdFromUrl(url = "") {
    const query = {}
    try {
        const queryParams = url.split("?")[1]
        if (queryParams) {
            const params = queryParams.split("&")
            for (const _query of params) {
                const [key, value] = _query.split("=")

                if (key && value) {
                    query[key] = value
                }
            }
        }
        return query
    } catch (error) {
        return query
    }
}

// User account following or un-following route handler
export default async function follow(req = new NextRequest(), res) {
    // makes sure the user is authenticated

    const authUser = await Authenticate(req, res)

    if (!authUser) {
        return
    }

    const { pid: profileId } = req.body

    res.setHeader("content-type", "application/json")
    // checks for userId request data
    if (!profileId) {
        res.status(400).send(
            JSON.stringify({
                message: "Invalid request",
            }),
        )
        return res.end()
    }

    // making sure the userId exist in the database
    const profileUser = await Users.findOne(
        { _id: profileId },
        { followers: 1 },
    ).populate("followers")

    if (!profileUser) {
        res.status(404).send(
            JSON.stringify({
                message: "Account Not Found",
            }),
        )
        return res.end()
    }

    // checks to see if users is already following the profile
    const isAlreadyFollowing = profileUser.followers.find(
        (user) => user.id === authUser.id,
    )

    let joined = false

    // Updating the profile followers list
    if (isAlreadyFollowing) {
        profileUser.followers = profileUser.followers.filter(
            (user) => user.id !== authUser.id,
        )
        authUser.following = authUser.following.filter(
            (user) => user.id !== profileUser.id,
        )
    } else {
        joined = true
        profileUser.followers.push(authUser._id)
        authUser.following.push(profileUser._id)
    }

    // save the updated profile
    await profileUser.save()

    // emits a responses
    res.status(200).send(JSON.stringify({ joined }))
    return res.end()
}
