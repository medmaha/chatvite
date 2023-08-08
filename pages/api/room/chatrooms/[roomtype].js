// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectToDatabase from "../../../../src/server/db"
import Authenticate from "../../../../src/server/authenticate"
import { Room } from "../../../../src/server/mongodb/collections"

export default async function handler(req, res) {
    const authUser = await Authenticate(req, res)

    const { roomtype } = req.query

    if (!authUser) {
        return
    }

    const rooms = await Room.find({
        isPrivate: roomtype === "private",
        host: authUser._id,
    }).select("-host")

    res.setHeader("content-type", "application/json")
    res.status(200).send(rooms)
}
