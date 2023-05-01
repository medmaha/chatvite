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

    const {
        search,
        q: query,
        tid: topicId,
        page,
        ...otherParams
    } = urlStringToObject(url)

    const pageIndex = page || 0
    const maxPageData = 25

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

    let dbQuery = null

    // get rooms that belongs to a specific topic
    if (query && topicId && !search) {
        const topic = await Topic.findOne({ slug: query })

        if (topic.id !== topicId) return await setInvalidResponse(res)

        dbQuery = [
            {
                topic: topic._id,
                isPrivate: false,
            },
        ]

        if (authUser) {
            dbQuery.push({
                isPrivate: true,
                topic: topic._id,
                host: authUser._id,
            })
        }
    }

    if (search) {
        const regex = new RegExp(search, "ig")
        const topics = await Topic.find({
            name: {
                $regex: regex,
            },
        })

        dbQuery = [
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
        if (authUser) {
            const authUserQuery = dbQuery.map((query) => {
                query.isPrivate = true
                query.host = authUser._id
                return query
            })
            dbQuery = [
                {
                    topic: {
                        $in: topics.map((t) => t._id),
                    },
                },
                ...dbQuery,
                ...authUserQuery,
            ]
        }
    }

    if (!dbQuery) {
        dbQuery = [
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
    }

    const paginatorResponse = await getChatviteRooms({
        pageIndex,
        maxPageData,
        queryList: dbQuery,
    })

    res.status(200).send(JSON.stringify(paginatorResponse))
}

async function getChatviteRooms({
    queryList,
    pageIndex = 0,
    maxPageData = 25,
}) {
    const urlPath = "/api/feed"
    const paginatorResponse = await getPaginatorResponse({
        model: Rooms,
        urlPath,
        pageIndex,
        maxPageData,
        query: { $or: queryList },
        sort: { createdAt: -1 },
        projector: {
            // chats: 0,
            name: 1,
            slug: 1,
            chatfuses: 0,
            members: 1,
            createdAt: 1,
            AI_MODEL: 0,
        },
        queryOptions: {
            populate: [
                {
                    path: "members",
                    select: ["_id"],
                    limit: 5,
                },
            ],
        },
    })
    return paginatorResponse
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
