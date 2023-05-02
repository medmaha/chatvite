const RESPONSE = {
    pageIndex: 0,
    totalPages: 0,
    totalData: 100,
    maxPageData: 25,
    data: {},
    links: {
        next: null,
        prev: null,
    },
}

export async function getPaginatorResponse({
    model,
    query = {},
    projector,
    queryOptions,
    pageIndex = 0,
    maxPageData = 25,
    populate = [],
    sort = {},
    urlPath = "",
}) {
    pageIndex = Number(pageIndex)
    const totalData = (await model.find()).length

    const response = { ...RESPONSE }

    response.pageIndex = pageIndex
    response.maxPageData = maxPageData

    if (totalData <= maxPageData) {
        const OBJECTS_DATA = await model.find(query, projector, queryOptions)
        response.totalData = OBJECTS_DATA.length
        return {
            ...response,
            pageIndex: 1,
            totalPages: 1,
            data: OBJECTS_DATA,
            links: {
                next: null,
                prev: null,
            },
        }
    }

    if (totalData > maxPageData) {
        response.totalPages = Math.round(totalData / maxPageData)

        if (pageIndex > response.totalPages) {
            response.links = {
                prev: `${process.env.BASE_URL}${urlPath}?page=${response.totalPages}`,
                next: null,
            }
            response.data = []
            return response
        }

        let SKIP_SIZE = pageIndex * maxPageData
        let PAGE_SIZE_TOUCHED = false

        if (pageIndex >= response.totalPages)
            if (maxPageData * response.totalPages > totalData) {
                PAGE_SIZE_TOUCHED = true
                SKIP_SIZE = (pageIndex - 1) * maxPageData
            }

        const OBJECTS_DATA = await model
            .find(query, projector, queryOptions)
            .skip(SKIP_SIZE)
            .limit(maxPageData)
            .populate(populate)
            .sort(sort)

        response.totalData = OBJECTS_DATA.length

        if (pageIndex > 0) {
            response.links = {}
            response.links.next = `${process.env.BASE_URL}/${urlPath}?page=${
                pageIndex + 1
            }`

            if (pageIndex > 1)
                response.links.prev = `${
                    process.env.BASE_URL
                }/${urlPath}?page=${pageIndex - 1}`
            else response.links.prev = `${process.env.BASE_URL}${urlPath}`
        } else {
            response.links = { prev: null }
            response.links.next = `${process.env.BASE_URL}${urlPath}?page=${1}`
        }
        response.data = OBJECTS_DATA
        response.pageDataLength = OBJECTS_DATA.length

        if (PAGE_SIZE_TOUCHED) {
            response.links.next = null
        }
    } else {
        const OBJECTS_DATA = await model
            .find(query, projector, queryOptions)
            .limit(maxPageData)
        response.data = OBJECTS_DATA
        response.links = { next: null, prev: null, links: "broken" }
        response.totalPages = Math.round(totalData / maxPageData)

        response.totalData = OBJECTS_DATA.length
    }

    return response
}
