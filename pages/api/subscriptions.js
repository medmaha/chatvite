import connectToDatabase from "../../src/server/db"
import { Subscriptions } from "../../src/server/mongodb/collections"
import { getPaginatorResponse } from "../../src/utils/paginator/paginatorResponse"

export default async function handler(req, res) {
    const { email } = req.body

    res.setHeader("content-type", "application/json")

    if (!email) {
        res.status(400).json({ message: "Invalid email address" })
        return res.end()
    }

    await connectToDatabase()

    await Subscriptions.create({ email: email })

    res.status(200).json({
        message: `Thank you for subscribing, ${
            email.split("@")[0]
        }. Chatvite will keep you informed of its insights.`,
    })
}
