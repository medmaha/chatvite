// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDatabase from "../../../src/server/db"
import { Room, Topic } from "../../../src/server/mongodb/collections"

import { NextRequest, NextResponse } from "next/server"

export default async function handler(
    req = new NextRequest(),
    res = new NextResponse(),
) {
    await connectToDatabase()

    const url = req.url

    const {
        search,
        q: query,
        tid: topicId,
        ...otherParams
    } = urlStringToObject(url)

    let rooms

    if (query && topicId && !search) {
        if (topicId.length > 24) {
            await setInvalidResponse(res)
            return
        }
        const topic = await Topic.findOne({ slug: query })

        if (topic.id === topicId) {
            rooms = await Room.find({ topic: topic._id, isPrivate: false })
        }
        if (!rooms?.length) {
            await setInvalidResponse(res)
        } else {
            res.setHeader("Content-Type", "application/json")
            res.status(200).end(JSON.stringify(rooms))
        }
        return
    }

    if (search) {
        const regex = new RegExp(search, "ig")
        const topic = await Topic.findOne({
            name: {
                $regex: regex,
            },
        })

        const dbQuery = [
            {
                description: {
                    $regex: regex,
                },
            },
            {
                name: {
                    $regex: regex,
                },
            },
        ]

        if (topic) {
            dbQuery.unshift({
                topic: topic._id,
            })
        }

        rooms = await Room.find({
            $or: [...dbQuery],
            isPrivate: false,
        })

        res.setHeader("Content-Type", "application/json")
        res.status(200).end(JSON.stringify(rooms))
        return
    }

    if ((query && !topicId) || (!query && topicId)) {
        await setInvalidResponse(res)
        return
    }

    if (!!Object.keys(otherParams).length) {
        await setInvalidResponse(res)
        return
    }

    rooms = await Room.find({ isPrivate: false }).sort({ members: -1 })

    res.setHeader("Content-Type", "application/json")
    res.status(200).end(JSON.stringify(rooms))
    // res.end()
}

function urlStringToObject(url) {
    const query = url?.split("?")[1]
    const obj = {}
    if (query) {
        const queries = query.split("&")
        for (const q of queries) {
            const [key, value] = q.split("=")

            obj[key] = value
        }
        return obj
    }
    return obj
}

async function setInvalidResponse(res) {
    res.setHeader("Content-Type", "application/json")
    res.status(400).end(JSON.stringify({ message: "Invalid query Params" }))
    Promise.resolve()
}
