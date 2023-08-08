import connectToDatabase from "../../../src/server/db"

import bcrypt from "bcrypt"

import { User } from "../../../src/server/mongodb/collections"
export default async function handler(req, res) {
    res.setHeader("content-type", "application/json")

    await connectToDatabase()

    const { email, username, password, csrfToken } = req.body

    if (!email || !username || !password || !csrfToken) {
        res.status(400).send(JSON.stringify({ message: "Bad request" }))
        return
    }

    // if (email.match(/admin/)) {
    //     res.status(400).send(
    //         JSON.stringify({
    //             message: 'email cannot contain "admin"',
    //             path: "email",
    //         }),
    //     )
    //     return res.end()
    // }
    // if (username.match(/admin/)) {
    //     res.status(400).send(
    //         JSON.stringify({
    //             message: 'username cannot contain "admin"',
    //             path: "username",
    //         }),
    //     )
    //     return res.end()
    // }

    const checkEmail = await User.findOne({ email: email })
    const checkUsername = await User.findOne({ username: username })

    if (checkEmail?._id) {
        res.status(400).send(
            JSON.stringify({ message: "email already exist", path: "email" }),
        )
        return res.end()
    }
    if (checkUsername?._id) {
        res.status(400).send(
            JSON.stringify({
                message: "username already exist",
                path: "username",
            }),
        )
        return res.end()
    }

    const checkPassword = (() => {
        if (typeof password !== "string") return true
        if (String(password).length < 4) return true
    })()

    if (checkPassword) {
        res.status(400).send(
            JSON.stringify({
                message: "password too short",
                path: "password",
            }),
        )
        return res.end()
    }

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)

    const hash = await bcrypt.hash(password, salt)

    await User.create({ email, username, password: hash })

    res.status(201).send(JSON.stringify({ message: "success" }))
    return res.end()
}
