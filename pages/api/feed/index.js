// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Authenticate from "../../../src/server/authenticate"
import connectToDatabase from "../../../src/server/db"
import { Room, Topic } from "../../../src/server/mongodb/collections"

import { NextRequest, NextResponse } from "next/server"

export default async function handler(
    req = new NextRequest(),
    res = new NextResponse(),
) {
    const authUser = await Authenticate(req, res, { sendResponse: false })

    const url = req.url

    const page_obj_count = 25

    const {
        search,
        q: query,
        tid: topicId,
        ...otherParams
    } = urlStringToObject(url)

    let rooms

    res.setHeader("Content-Type", "application/json")

    if ((query && !topicId) || (!query && topicId)) {
        return await setInvalidResponse(res)
    }

    if (topicId?.length > 24) {
        return await setInvalidResponse(res)
    }

    if (!!Object.keys(otherParams).length) {
        return await setInvalidResponse(res)
    }

    // get rooms that belongs to a specific topic
    if (query && topicId && !search) {
        const topic = await Topic.findOne({ slug: query })
        if (topic.id === topicId) {
            const dbQuery = [
                {
                    topic: topic._id,
                    isPrivate: false,
                },
            ]
            if (authUser) {
                dbQuery.push({
                    topic: topic._id,
                    isPrivate: true,
                    host: authUser._id,
                })
            }
            rooms = await getChatviteRooms(dbQuery).limit(page_obj_count)
            res.status(200).send(JSON.stringify(rooms))
        } else {
            await setInvalidResponse(res)
        }
        return
    }

    if (search) {
        const regex = new RegExp(search, "ig")
        const topics = await Topic.find({
            name: {
                $regex: regex,
            },
        })

        const dbQuery = [
            {
                name: {
                    $regex: regex,
                },
                isPrivate: false,
            },
            {
                slug: {
                    $regex: regex,
                },
                isPrivate: false,
            },
            {
                description: {
                    $regex: regex,
                },
                isPrivate: false,
            },
        ]
        const authenticatedUserQuery = (function () {
            let data = []
            if (authUser) {
                data = dbQuery.map((q) => {
                    q.isPrivate = true
                    q.host = authUser._id
                    return q
                })
            }
            return data
        })()

        if (authUser) {
            rooms = await getChatviteRooms([
                {
                    topic: {
                        $in: topics.map((t) => t._id),
                    },
                },
                ...dbQuery,
                ...authenticatedUserQuery,
            ]).limit(page_obj_count)
        } else {
            rooms = await getChatviteRooms(dbQuery).limit(page_obj_count)
        }
        res.status(200).send(JSON.stringify(rooms))
        return
    }

    const dbQuery = [
        {
            isPrivate: false,
        },
    ]
    if (authUser) {
        dbQuery.push({
            host: authUser._id,
            isPrivate: true,
        })
    }

    rooms = await getChatviteRooms(dbQuery)
        .sort({ createdAt: -1 })
        .limit(page_obj_count)
    res.status(200).send(JSON.stringify(rooms))
}

function getChatviteRooms(queryList) {
    return Room.find({ $or: queryList })
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
    res.status(400).end(JSON.stringify({ message: "Invalid query Params" }))
    Promise.resolve()
}
