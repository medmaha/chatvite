import { Chat, Room } from "../../src/server/mongodb/collections"
import { getPaginatorResponse } from "../../src/utils/paginator/paginatorResponse"

export default async function handler(req, res) {
    const { page: pageIndex = 0 } = req.query

    const PAGE_DATA_LIMIT = 25

    const urlPath = req.url.split("?")[0]
    console.log(urlPath)

    const response = await getPaginatorResponse({
        model: Chat,
        pageIndex,
        urlPath,
        maxPageData: PAGE_DATA_LIMIT,
        populate: [{ path: "sender" }, { path: "room" }],
    })

    res.status(200).json(response)
}
