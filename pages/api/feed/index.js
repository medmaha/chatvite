// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Authenticate from "../../../src/server/authenticate"
import connectToDatabase from "../../../src/server/db"
import { Room as Rooms, Topic } from "../../../src/server/mongodb/collections"

import { NextRequest, NextResponse } from "next/server"
import { getPaginatorResponse } from "../../../src/utils/paginator/paginatorResponse"
import { populate } from "../../../src/server/mongodb/collections/users"

export default async function handler(
    req = new NextRequest(),
    res = new NextResponse(),
) {
    const authUser = await Authenticate(req, res, { sendResponse: false })
    // const authUser = null

    const url = req.url
    const urlPath = req.url.split("?")[0]
    const maxPageData = 25

    const {
        search,
        q: query,
        tid: topicId,
        page: pageIndex = 0,
        ...otherParams
    } = urlStringToObject(url)

    let room

    res.setHeader("Content-Type", "application/json")

    if ((query && !topicId) || (!query && topicId)) {
        return await setInvalidResponse(res)
    }

    if (topicId && topicId.length !== 24) {
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

            const paginatorResponse = await getPaginatorResponse({
                model: Rooms,
                urlPath,
                pageIndex,
                maxPageData,
                query: { $or: dbQuery },
                sort: { createdAt: -1 },
                projector: { chatfuses: 0 },
                populate: [{ path: "members", select: ["_id"] }],
            })

            res.status(200).send(JSON.stringify(paginatorResponse))
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
        let response

        if (authUser) {
            const _dbQuery = [
                {
                    topic: {
                        $in: topics.map((t) => t._id),
                    },
                },
                ...dbQuery,
                ...authenticatedUserQuery,
            ]
            const paginatorResponse = await getPaginatorResponse({
                model: Rooms,
                urlPath,
                pageIndex,
                maxPageData,
                query: { $or: _dbQuery },
                projector: { chatfuses: 0 },
                populate: [{ path: "members", select: ["_id"] }],
            })
            response = paginatorResponse
        } else {
            const paginatorResponse = await getPaginatorResponse({
                model: Rooms,
                urlPath,
                pageIndex,
                maxPageData,
                query: { $or: dbQuery },
                projector: { chatfuses: 0 },
                populate: [{ path: "members", select: ["_id"] }],
            })
            response = paginatorResponse
        }
        res.status(200).send(JSON.stringify(response))
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

    const paginatorResponse = await getPaginatorResponse({
        model: Rooms,
        urlPath,
        pageIndex,
        maxPageData,
        query: { $or: dbQuery },
        sort: { createdAt: -1 },
        projector: { chatfuses: 0 },
        populate: [{ path: "members", select: ["_id"] }],
    })
    res.status(200).send(JSON.stringify(paginatorResponse))
}

function getChatviteRooms(queryList, page = 0, count = 25) {
    return Rooms.find({ $or: queryList }).skip(page * count)
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
