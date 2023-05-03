// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDatabase from "../../../src/server/db"
import Authenticate from "../../../src/server/authenticate"
import { Room } from "../../../src/server/mongodb/collections"
import Users from "../../../src/server/mongodb/collections/users"
import { getPaginatorResponse } from "../../../src/utils/paginator/paginatorResponse"

// import io from "../../socket"

export default async function handler(req, res) {
    const authUser = await Authenticate(req, res, { sendResponse: false })

    const { slug } = req.query

    const room = await Room.findOne(
        { slug },
        {
            members: 0,
            _v: 0,
        },
    )

    // const room = getPaginatorResponse({
    //     urlPath:req.url.split('?'),
    //     query:{slug},
    //     model:Room,
    // })

    res.setHeader("Content-Type", "application/json")

    if (!room) {
        return res.status(404).json({ message: "Bad Request" })
    }

    if (room.isPrivate) {
        res.setHeader("Content-Type", "application/json")

        if (!authUser) {
            return res
                .status(403)
                .send({ message: "This request is forbidden" })
        }

        if (room.host.id !== authUser.id) {
            return res
                .status(403)
                .send({ message: "This request is forbidden" })
        }

        const data = room.toJSON()
        delete data["members"]
        return res.status(200).send(JSON.stringify(data))
    }

    res.status(200).send(JSON.stringify(room.toJSON()))
}
