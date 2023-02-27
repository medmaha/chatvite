import connectToDatabase from "../../../../src/server/db"
import Users from "../../../../src/server/mongodb/collections/users"

export default async function handler(req, res) {
    await connectToDatabase()

    const { param, query } = req
    const { data: usernameList } = req.body

    const regex = () => {
        let text = "^("
        for (const f of usernameList) {
            text += f + "|"
        }
        // ensure that it exist

        text += ")$"

        return new RegExp(text)
    }

    console.log(regex())

    const results = await Users.find(
        {
            username: {
                $regex: regex(),
            },
        },
        { username: 1 },
    )

    const flat = results.flatMap((doc) => doc.username)

    res.status(200).json(
        usernameList.filter((name) => {
            return flat.includes(name) == false
        }),
    )
}
